import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RoomObjects } from "./RoomObjects";
import { RoomServices } from "../../services/RoomServices";
import { CopyIcon } from "./CopyIcon";
import emptyImage from "../../assets/images/empty_list.svg";

const roomServices = new RoomServices();

export const RoomHome = () => {

    const navigate = useNavigate();
    const { link } = useParams();
    const [name, setName] = useState('');
    const [color, setColor] = useState('');
    const [objects, setObjects] = useState([]);

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