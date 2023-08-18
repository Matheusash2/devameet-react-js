import React, { useEffect, useState } from "react";
import { MeetServices } from "../../services/MeetServices";
import emptyImage from "../../assets/images/empty_list.svg";
import { MeetListItem } from "./MeetListItem";
import { Modal } from "react-bootstrap";

const meetServices = new MeetServices();

type MeetListProps = {
    setObjects(o: any): void;
    setLink(s: string): void;
};

export const MeetList: React.FC<MeetListProps> = ({ setObjects, setLink }) => {
    const [meets, setMeets] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);

    const getMeets = async () => {
        try {
            const result = await meetServices.getMeets();
            if (result?.data) {
                setMeets(result.data);
            }
        } catch (e) {
            console.log("Ocorreu erro ao listar reuniões:", e);
        }
    };

    const selectToRemove = (id: string) => {
        setSelected(id);
        setShowModal(true);
    };

    const cancelSelection = () => {
        setSelected(null);
        setShowModal(false);
    };

    const selectMeetWithObjects = async (meet: any) => {
        try {
            const objectsResult = await meetServices.getMeetObjectsById(
                meet?.id
            );
            console.log(objectsResult);
            if (objectsResult?.data) {
                const newObjects = objectsResult?.data?.map((e: any) => {
                    return { ...e, type: e?.name?.split("_")[0] };
                });
                console.log(newObjects);
                setObjects(newObjects);
                setSelected(meet?.id);
                setLink(meet?.link);
            }
        } catch (e) {
            console.log("Ocorreu erro ao listar objetos da reunião:", e);
        }
    };

    const removeMeet = async () => {
        try {
            if (!selected) {
                return;
            }

            await meetServices.deleteMeet(selected);
            await getMeets();
            cancelSelection();
        } catch (e) {
            console.log("Ocorreu erro ao excluir reunião:", e);
        }
    };

    useEffect(() => {
        getMeets();
    }, []);

    return (
        <>
            <div className="scroll">
                <div className="container-meet-list">
                    {meets && meets.length > 0 ? (
                        meets.map((meet: any) => (
                            <MeetListItem
                                key={meet.id}
                                meet={meet}
                                selectMeet={selectMeetWithObjects}
                                selectToRemove={selectToRemove}
                                selected={selected || ""}
                            />
                        ))
                    ) : (
                        <div className="empty">
                            <img src={emptyImage} alt="Lista vazia" />
                            <p>Você ainda não possui reuniões criadas :(</p>
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
                            <span>Deletar reunião</span>
                            <p>Deseja deletar a reunião</p>
                            <p>Essa ação não poderá ser desfeita</p>
                        </div>
                        <div className="actions">
                            <span onClick={cancelSelection}>Cancelar</span>
                            <button onClick={removeMeet}>Confirmar</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};
