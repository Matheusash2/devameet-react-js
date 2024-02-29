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
import { Loading } from "../general/Loading";
import videoIconOff from "../../assets/images/video_off.svg";
import { BannedServices } from "../../services/BannedServices";

const roomServices = new RoomServices();
const bannedServices = new BannedServices();
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
    const [showModalBanned, setShowModalBanned] = useState(false);
    const [showModalBannedErro, setShowModalBannedErro] = useState(false);
    const [objectWalkable, setObjectWalkable] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [inRoom, setInRoom] = useState(false);
    const [selectedMeet, setSelectedMeet] = useState<string>("");
    const [selectedUser, setSelectedUser] = useState<string>("");
    const [usersBanned, setUsersBanned] = useState([]);
    const [meet, setMeet] = useState<any>({});
    const [selectedClientId, setSelectedClientId] = useState<string>("");
    const [userBan, setUserBan] = useState(false);
    const userId = localStorage.getItem("id") || "";
    const mobile = window.innerWidth <= 992;

    const getRoom = async () => {
        try {
            setIsLoading(true);
            if (!link) {
                return navigate("/");
            }

            const result = await roomServices.getRoomByLink(link);

            if (!result || !result.data) {
                return;
            }
            const { _id, name, color, objects } = result.data;
            console.log("resultEnter: ", result.data);

            listUsersBanned(_id);
            setMeet(_id);
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

            if (document.getElementById("localVideoRefMe")) {
                const videoRef: any =
                    document.getElementById("localVideoRefMe");
                videoRef.srcObject = userMediaStream;
            }

            setIsLoading(false);
        } catch (e) {
            setIsLoading(false);
            console.log("Ocorreu erro ao buscar dados da sala:", e);
        }
    };

    useEffect(() => {
        getRoom();
        getUsersWithoutMe();
        listUsersBanned(meet);
    }, []);

    useEffect(() => {
        document.addEventListener("keyup", (event: any) => doMovement(event));

        return () => {
            document.removeEventListener("keyup", (event: any) =>
                doMovement(event)
            );
        };
    }, [objectWalkable]);

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
                console.log("usersWithouMe", usersWithoutMe);
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
        objectsWalkableRoom();
        setInRoom(true);
    };

    const toggleMute = () => {
        const payload = {
            userId,
            link,
            muted: !me.muted,
        };

        wsServices.updateUserMute(payload);
    };

    const objectsWalkableRoom = () => {
        let objectsPosition: any[] = [];

        objects?.map((object: any) => {
            if (object.walkable === false) {
                let y = object.y;
                let x = object.x;
                let width = object.width;
                let height = object.height;

                for (width; width > 0; width--) {
                    for (height; height > 0; height--) {
                        objectsPosition.push([x, y - 1]);
                        y++;
                    }
                    y = object.y;
                    height = object.height;
                    x++;
                }
            }
        });
        setObjectWalkable([objectsPosition]);
        console.log("objects", objectsPosition);
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
                case "ArrowUp": {
                    if (objectWalkable[0]) {
                        payload.x = user.x;
                        payload.orientation = "back";
                        if (user.orientation === "back") {
                            payload.y = user.y > 1 ? user.y - 1 : 1;
                        } else {
                            payload.y = user.y;
                        }
                        console.log("objectWalk", objectWalkable);
                        objectWalkable[0].map((obj: any) => {
                            if (obj[0] === payload.x && obj[1] === payload.y) {
                                payload.x = user.x;
                                payload.y = user.y;
                            }
                        });
                    }
                    break;
                }
                case "ArrowDown": {
                    if (objectWalkable[0]) {
                        payload.x = user.x;
                        payload.orientation = "front";
                        if (user.orientation === "front") {
                            payload.y = user.y < 6 ? user.y + 1 : 6;
                        } else {
                            payload.y = user.y;
                        }
                        objectWalkable[0].map((obj: any) => {
                            if (obj[0] === payload.x && obj[1] === payload.y) {
                                payload.x = user.x;
                                payload.y = user.y;
                            }
                        });
                    }
                    break;
                }
                case "ArrowLeft": {
                    if (objectWalkable[0]) {
                        payload.y = user.y;
                        payload.orientation = "left";
                        if (user.orientation === "left") {
                            payload.x = user.x > 0 ? user.x - 1 : 0;
                        } else {
                            payload.x = user.x;
                        }
                        objectWalkable[0].map((obj: any) => {
                            if (obj[0] === payload.x && obj[1] === payload.y) {
                                payload.x = user.x;
                                payload.y = user.y;
                            }
                        });
                    }
                    break;
                }
                case "ArrowRight": {
                    if (objectWalkable[0]) {
                        payload.y = user.y;
                        payload.orientation = "right";
                        if (user.orientation === "right") {
                            payload.x = user.x < 7 ? user.x + 1 : 7;
                        } else {
                            payload.x = user.x;
                        }
                        objectWalkable[0].map((obj: any) => {
                            if (obj[0] === payload.x && obj[1] === payload.y) {
                                payload.x = user.x;
                                payload.y = user.y;
                            }
                        });
                    }
                    break;
                }
                default:
                    break;
            }

            if (payload.x >= 0 && payload.y >= 0 && payload.orientation) {
                wsServices.updateUserMovement(payload);
                console.debug("payload", payload);
            }
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
    };

    const getUsersWithoutMe = () => {
        console.log("userId", userId);
        console.log("connectedUsers", connectedUsers);
        const usersRoom = connectedUsers.filter((u: any) => u.user !== userId);
        return usersRoom;
    };

    const userName = (user: any) => {
        if (user?.name) {
            return user.name.split(" ")[0];
        }
        return " ";
    };

    const getMutedVideoClass = (user: any) => {
        if (user?.muted) {
            return "mutedVideo";
        }
        return "";
    };

    const getMutedClass = (user: any) => {
        if (user?.muted) {
            return "muted";
        }
        return "";
    };

    const bannedUsers = async () => {
        try {
            if (selectedUser && selectedMeet) {
                await bannedServices.createBanned({
                    userBannedId: selectedUser,
                    meet: selectedMeet,
                });
                const bannedUser = connectedUsers.find(
                    (user: any) => user.user === selectedUser
                );              
                if (bannedUser) {
                    const { clientId } = bannedUser;
                    console.log("socketId do usuário banido:", clientId);
                    const clientIdBanned: string = clientId
                    console.log("clientIdBan do usuário banido:", clientIdBanned);
                    setSelectedClientId(clientIdBanned);
                    console.log("setSelectedClientId teste", setSelectedClientId.toString());
                }
            console.log("selectedClientId 2:", selectedClientId)

            }
            const userId = selectedUser;
            const meetId = selectedMeet.toString();
            console.log("meetId do usuário banido:", meetId);
            console.log("selectedClientId:", selectedClientId)
            const clientId = selectedClientId.toString();
            console.log("teste de clientId:", clientId);
            const payload = {
                clientId,
                userId,
                meetId
            } as any;

            wsServices.removeUserBan(payload)
            listUsersBanned(meet);
            setSelectedUser("");
            setSelectedMeet("");
            setShowModalBanned(false);
        } catch (e: any) {
            setShowModalBanned(false);
            setShowModalBannedErro(true);
            setSelectedUser("");
            setSelectedMeet("");
            if (e?.response?.data?.message) {
                console.log(
                    "Erro ao banir usuário:",
                    e?.response?.data?.message
                );
            } else {
                console.log("Erro ao banir usuário:", e);
            }
        }
    };

    const selectToBan = (user: string, meet: string) => {
        if (user !== userId) {
            setSelectedUser(user);
            setSelectedMeet(meet);
            setShowModalBanned(true);
        }
        return "";
    };

    const cancelBan = () => {
        setSelectedUser("");
        setShowModalBanned(false);
    };

    const listUsersBanned = async (meetId: string) => {
        const result = await bannedServices.getBannedByMeet(meetId);
        setUsersBanned(result.data);
        console.log("List Banned: ", result.data);
    };

    return (
        <>
            <div className="container-principal">
                {isLoading ? (
                    <Loading />
                ) : (
                    <div className="container-room">
                        {objects.length > 0 ? (
                            <>
                                <div className="container-audio-video-users">
                                    <div className="other-user">
                                        {getUsersWithoutMe()?.map(
                                            (user: any, index) => (
                                                <div
                                                    key={index}
                                                    className="container-media"
                                                >
                                                    {mobile ? (
                                                        <audio
                                                            key={user.clientId || ""}
                                                            id={user.clientId}
                                                            playsInline
                                                            autoPlay
                                                            muted={user?.muted}
                                                        />
                                                    ) : (
                                                        <div className="container-video-audio">
                                                            <div className="row-video-name">
                                                                {inRoom && (
                                                                    <div
                                                                        className={"name-video " + getMutedClass(user)}>
                                                                        <span>
                                                                            {userName(user)}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                <div
                                                                    className={
                                                                        "video " +
                                                                        getMutedVideoClass(user)}>
                                                                    {user.muted && (
                                                                        <img
                                                                            alt="Video desativado"
                                                                            src={videoIconOff}
                                                                            className="video-off"
                                                                        />
                                                                    )}
                                                                    <div
                                                                        className={"video-audio " + getMutedVideoClass(user)}
                                                                        key={user.clientId || ""}
                                                                    >
                                                                        <video
                                                                            className="localVideoRefUser"
                                                                            key={user.clientId || ""}
                                                                            id={user.clientId}
                                                                            playsInline
                                                                            autoPlay
                                                                            muted={user?.muted}
                                                                        />
                                                                        <audio
                                                                            className="localVideoRefUser"
                                                                            key={user.clientId || ""}
                                                                            id={user.clientId}
                                                                            playsInline
                                                                            autoPlay
                                                                            muted={user?.muted}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                    <div className="resume">
                                        <div className="copy-link">
                                            <div onClick={copyLink}>
                                                <span>
                                                    <strong>Reunião</strong>
                                                    {link}
                                                </span>
                                                <CopyIcon color={color} />
                                            </div>
                                            <p style={{ color }}>{name}</p>
                                        </div>
                                        {mobile ? (
                                            <audio
                                                id="localVideoRefMe"
                                                playsInline
                                                autoPlay
                                                muted
                                            />
                                        ) : (
                                            <div className="container-video-audio-me">
                                                <div className="row-video-name-me">
                                                    {inRoom && (
                                                        <div
                                                            className={"name-video-me " + getMutedClass(me)}
                                                        >
                                                            <span>
                                                                {userName(me)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="video-me ">
                                                        {me.muted && (
                                                            <img
                                                                alt="Video desativado"
                                                                src={videoIconOff}
                                                                className="video-off"
                                                            />
                                                        )}
                                                        <div
                                                            className={"video-audio-me " + getMutedVideoClass(me)}
                                                        >
                                                            <video
                                                                id="localVideoRefMe"
                                                                playsInline
                                                                autoPlay
                                                                muted
                                                            />
                                                            <audio
                                                                id="localVideoRefMe"
                                                                playsInline
                                                                autoPlay
                                                                muted
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <RoomObjects
                                    objects={objects}
                                    enterRoom={enterRoom}
                                    connectedUsers={connectedUsers}
                                    me={me}
                                    toggleMute={toggleMute}
                                    selectedToBan={selectToBan}
                                    selectedUser={selectedUser}
                                    selectedMeet={selectedMeet}
                                    usersBanned={usersBanned}
                                    meet={meet}
                                    user={userId}
                                />
                                {mobile && me?.user && (
                                    <div className="movement">
                                        <div
                                            className="button"
                                            onClick={() => doMovement({ key: "ArrowUp" })}
                                        >
                                            <img
                                                src={upIcon}
                                                alt="Andar para cima"
                                            />
                                        </div>
                                        <div className="line">
                                            <div
                                                className="button"
                                                onClick={() => doMovement({ key: "ArrowLeft" })}
                                            >
                                                <img
                                                    src={leftIcon}
                                                    alt="Andar para esquerda"
                                                />
                                            </div>
                                            <div
                                                className="button"
                                                onClick={() => doMovement({ key: "ArrowDown" })}
                                            >
                                                <img
                                                    src={downIcon}
                                                    alt="Andar para baixo"
                                                />
                                            </div>
                                            <div
                                                className="button"
                                                onClick={() => doMovement({ key: "ArrowRight" })}
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
                                <img
                                    src={emptyImage}
                                    alt="Reunião não encotrada"
                                />
                                <p>Reunião não encontrada :/</p>
                            </div>
                        )}
                    </div>
                )}
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
            <Modal
                show={showModalBanned}
                onHide={() => setShowModalBanned(false)}
                className="container-modal"
            >
                <Modal.Body>
                    <div className="content">
                        <div className="container">
                            <span>Banir usuário</span>
                            <p>Deseja banir o usuário</p>
                            <p>Essa ação não poderá ser desfeita</p>
                        </div>
                        <div className="actions">
                            <span onClick={cancelBan}>Cancelar</span>
                            <button onClick={bannedUsers}>Confirmar</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal
                show={showModalBannedErro}
                onHide={() => setShowModalBannedErro(false)}
                className="container-modal"
            >
                <Modal.Body>
                    <div className="content">
                        <div className="container">
                            <span>Erro!</span>
                            <p>Só o criador da sala pode banir</p>
                        </div>
                        <div className="actions">
                            <button
                                onClick={() => setShowModalBannedErro(false)}
                            >
                                Ok
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            {userBan && 
                <Modal
                show={userBan}
                onHide={() => setUserBan(false)}
                className="container-modal"
            >
                    <Modal.Body>
                        <div className="content">
                            <div className="container">
                                <span>Aviso!</span>
                                <p>Um usuário foi banido. Por favor, entre novamente na sala</p>
                            </div>
                            <div className="actions">
                                <button
                                    onClick={() => window.location.reload()}
                                >
                                    Ok
                                </button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            } 
        </>
    );
};
