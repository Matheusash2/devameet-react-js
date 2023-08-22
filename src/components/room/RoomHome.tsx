import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RoomObjects } from "./RoomObjects";
import { RoomServices } from "../../services/RoomServices";
import { createPeerConnectionContext } from "../../services/WebSocketServices";
import { CopyIcon } from "./CopyIcon";
import emptyImage from "../../assets/images/empty_list.svg";
import upIcon from "../../assets/images/chevron_up.svg";
import leftIcon from "../../assets/images/chevron_left.svg";
import downIcon from "../../assets/images/chevron_down.svg";
import rightIcon from "../../assets/images/chevron_right.svg";
import { Modal } from "react-bootstrap";

const roomServices = new RoomServices();
const wsServices = createPeerConnectionContext();

let userMediaStream: any;

export const RoomHome = () => {
    const navigate = useNavigate();
    const { link } = useParams();
    const [name, setName] = useState("");
    const [color, setColor] = useState("");
    const [objects, setObjects] = useState([]);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [me, setMe] = useState<any>({});
    const [showModal, setShowModal] = useState(false);
    const userId = localStorage.getItem("id") || "";
    const mobile = window.innerWidth <= 992;

    const getRoom = async () => {
        try {
            if (!link) {
                return navigate("/");
            }

            const result = await roomServices.getRoomByLink(link);

            if (!result || !result.data) {
                return;
            }
            const { name, color, objects } = result.data;

            setName(name);
            setColor(color);

            const newObjects = objects.map((o: any) => {
                return { ...o, type: o?.name?.split("_")[0] };
            });

            setObjects(newObjects);
            userMediaStream = await navigator?.mediaDevices?.getUserMedia({
                video: {
                    width: { min: 640, ideal: 1280 },
                    height: { min: 400, ideal: 1080 },
                    aspectRatio: { ideal: 1.7777 },
                },
                audio: true,
            });

            if (document.getElementById("localVideoRef")) {
                const videoRef: any = document.getElementById("localVideoRef");
                videoRef.srcObject = userMediaStream;
            }
        } catch (e) {
            console.log("Ocorreu erro ao buscar dados da sala:", e);
        }
    };

    useEffect(() => {
        getRoom();
    }, []);

    useEffect(() => {
        document.addEventListener("keyup", (event: any) => doMovement(event));

        return () => {
            document.removeEventListener("keyup", (event: any) =>
                doMovement(event)
            );
        };
    }, []);

    const enterRoom = () => {
        if (!userMediaStream) {
            return setShowModal(true);
        }

        if (!link || !userId) {
            return navigate("/");
        }
        wsServices.joinRoom(link, userId);
        wsServices.onCallMade();
        wsServices.onUpdateUserList(async (users: any) => {
            if (users) {
                setConnectedUsers(users);
                localStorage.setItem("connectedUsers", JSON.stringify(users));

                const me = users.find((u: any) => u.user === userId);
                if (me) {
                    setMe(me);
                    localStorage.setItem("me", JSON.stringify(me));
                }

                const usersWithoutMe = users.filter(
                    (u: any) => u.user !== userId
                );
                for (const user of usersWithoutMe) {
                    wsServices.addPeerConnection(
                        user.clientId,
                        userMediaStream,
                        (_stream: any) => {
                            if (document.getElementById(user.clientId)) {
                                const videoRef: any = document.getElementById(
                                    user.clientId
                                );
                                videoRef.srcObject = _stream;
                            }
                        }
                    );
                }
            }
        });

        wsServices.onRemoveUser((socketId: any) => {
            const connectedStr = localStorage.getItem("connectedUsers") || "";
            const connectedUsers = JSON.parse(connectedStr);
            const filtered = connectedUsers?.filter(
                (u: any) => u.clientId !== socketId
            );
            setConnectedUsers(filtered);
            wsServices.removePeerConnection(socketId);
        });

        wsServices.onAddUser((user: any) => {
            console.log("onAddUser", user);
            wsServices.addPeerConnection(
                user,
                userMediaStream,
                (_stream: any) => {
                    if (document.getElementById(user)) {
                        const videoRef: any = document.getElementById(user);
                        videoRef.srcObject = _stream;
                    }
                }
            );

            wsServices.callUser(user);
        });

        wsServices.onAnswerMade((socket: any) => wsServices.callUser(socket));
    };

    const toggleMute = () => {
        const payload = {
            userId,
            link,
            muted: !me.muted,
        };

        wsServices.updateUserMute(payload);
    };

    const doMovement = (event: any) => {
        const meStr = localStorage.getItem("me") || "";
        const user = JSON.parse(meStr);

        if (event && user) {
            const payload = {
                userId,
                link,
            } as any;

            switch (event.key) {
                case "ArrowUp":
                    payload.x = user.x;
                    payload.orientation = "back";
                    if (user.orientation === "back") {
                        payload.y = user.y > 0 ? user.y - 1 : 0;
                    } else {
                        payload.y = user.y;
                    }
                    break;
                case "ArrowDown":
                    payload.x = user.x;
                    payload.orientation = "front";
                    if (user.orientation === "front") {
                        payload.y = user.y < 6 ? user.y + 1 : 6;
                    } else {
                        payload.y = user.y;
                    }
                    break;
                case "ArrowLeft":
                    payload.y = user.y;
                    payload.orientation = "left";
                    if (user.orientation === "left") {
                        payload.x = user.x > 0 ? user.x - 1 : 0;
                    } else {
                        payload.x = user.x;
                    }
                    break;
                case "ArrowRight":
                    payload.y = user.y;
                    payload.orientation = "right";
                    if (user.orientation === "right") {
                        payload.x = user.x < 7 ? user.x + 1 : 7;
                    } else {
                        payload.x = user.x;
                    }
                    break;
                default:
                    break;
            }

            if (payload.x >= 0 && payload.y >= 0 && payload.orientation) {
                wsServices.updateUserMovement(payload);
                console.debug(payload);
            }
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
    };

    const getUsersWithoutMe = () => {
        return connectedUsers.filter((u: any) => u.user !== userId);
    };

    return (
        <>
            <div className="container-principal">
                <div className="container-room">
                    {objects.length > 0 ? (
                        <>
                            <div className="resume">
                                <div onClick={copyLink}>
                                    <span>
                                        <strong>Reunião</strong>
                                        {link}
                                    </span>
                                    <CopyIcon color={color} />
                                </div>
                                <p style={{ color }}>{name}</p>
                                {/*<video
                                    id="localVideoRef"
                                    playsInline
                                    autoPlay
                                    muted
                                />*/}
                                <audio
                                    id="localVideoRef"
                                    playsInline
                                    autoPlay
                                    muted
                                />
                                {getUsersWithoutMe()?.map((user: any) => (
                                    <audio
                                        key={user.clientId}
                                        id={user.clientId}
                                        playsInline
                                        autoPlay
                                        muted={user?.muted}
                                    />
                                ))}
                            </div>
                            <RoomObjects
                                objects={objects}
                                enterRoom={enterRoom}
                                connectedUsers={connectedUsers}
                                me={me}
                                toggleMute={toggleMute}
                            />
                            {mobile && me?.user && (
                                <div className="movement">
                                    <div
                                        className="button"
                                        onClick={() =>
                                            doMovement({ key: "ArrowUp" })
                                        }
                                    >
                                        <img
                                            src={upIcon}
                                            alt="Andar para cima"
                                        />
                                    </div>
                                    <div className="line">
                                        <div
                                            className="button"
                                            onClick={() =>
                                                doMovement({ key: "ArrowLeft" })
                                            }
                                        >
                                            <img
                                                src={leftIcon}
                                                alt="Andar para esquerda"
                                            />
                                        </div>
                                        <div
                                            className="button"
                                            onClick={() =>
                                                doMovement({ key: "ArrowDown" })
                                            }
                                        >
                                            <img
                                                src={downIcon}
                                                alt="Andar para baixo"
                                            />
                                        </div>
                                        <div
                                            className="button"
                                            onClick={() =>
                                                doMovement({
                                                    key: "ArrowRight",
                                                })
                                            }
                                        >
                                            <img
                                                src={rightIcon}
                                                alt="Andar para direita"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="empty">
                            <img src={emptyImage} alt="Reunião não encotrada" />
                            <p>Reunião não encontrada :/</p>
                        </div>
                    )}
                </div>
            </div>
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                className="container-modal"
            >
                <Modal.Body>
                    <div className="content">
                        <div className="container">
                            <span>Aviso!</span>
                            <p>
                                Habilite as permissões de audio e video para
                                parcticipar da reunião.
                            </p>
                        </div>
                        <div className="actions">
                            <button onClick={() => setShowModal(false)}>
                                Ok
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};
