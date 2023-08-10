import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RoomObjects } from "./RoomObjects";
import { RoomServices } from "../../services/RoomServices";
import { CopyIcon } from "./CopyIcon";
import emptyImage from "../../assets/images/empty_list.svg";
import { createPeerConnectionContext } from "../../services/WebSocketServices";

const roomServices = new RoomServices();
const wsServices = createPeerConnectionContext();

export const RoomHome = () => {

    const navigate = useNavigate();
    const { link } = useParams();
    const [name, setName] = useState('');
    const [color, setColor] = useState('');
    const [objects, setObjects] = useState([]);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [me, setMe] = useState<any>({});
    const userId = localStorage.getItem('id') || '';

    const getRoom = async () => {
        try {
            if (!link) {
                return navigate('/');
            }

            const result = await roomServices.getRoomByLink(link);

            if (!result || !result.data) {
                return;
            }
            const { name, color, objects } = result.data;

            setName(name);
            setColor(color);

            const newObjects = objects.map((o: any) => {
                return { ...o, type: o?.name?.split('_')[0] }
            });

            setObjects(newObjects);

        } catch (e) {
            console.log('Ocorreu erro ao buscar dados da sala:', e);
        }
    }

    useEffect(() => {
        getRoom();
    }, []);

    const enterRoom = () => {
        if (!link || !userId) {
            return navigate('/');
        }
        wsServices.joinRoom(link, userId);
        wsServices.onUpdateUserList(async (users: any) => {
            if (users) {
                setConnectedUsers(users);
                localStorage.setItem('connectedUsers', JSON.stringify(users));

                const me = users.find((u: any) => u.user === userId);
                if (me) {
                    setMe(me);
                    localStorage.setItem('me', JSON.stringify(me));
                }
            }
        });

        wsServices.onRemoveUser((socketId: any) => {
            const connectedStr = localStorage.getItem('connectedUsers') || '';
            const connectedUsers = JSON.parse(connectedStr);
            const filtered = connectedUsers?.filter((u: any) => u.clientId !== socketId);
            setConnectedUsers(filtered);
        });
    }

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
    }

    return (
        <div className="container-principal">
            <div className="container-room">
                {
                    objects.length > 0
                        ?
                        <>
                            <div className="resume">
                                <div onClick={copyLink}>
                                    <span><strong>Reunião</strong>{link}</span>
                                    <CopyIcon color={color} />
                                </div>
                                <p style={{ color }}>{name}</p>
                            </div><RoomObjects
                                objects={objects}
                                enterRoom={enterRoom}
                                connectedUsers={connectedUsers}
                                me={me}
                            />
                        </>
                        :
                        <div className="empty">
                            <img src={emptyImage} alt="Reunião não encotrada" />
                            <p>Reunião não encontrada :/</p>
                        </div>
                }
            </div>
        </div>
    );
}