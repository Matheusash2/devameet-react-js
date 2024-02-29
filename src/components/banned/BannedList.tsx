import React, { useEffect, useState } from "react";
import { Loading } from "../general/Loading";
import { BannedServices } from "../../services/BannedServices";
import { BannedListItem } from "./BannedListItem";
import { Modal } from "react-bootstrap";

const bannedServices = new BannedServices();

interface Banned {
    id: string;
    meet?: string;
    user?: string;
    userBanned?: string;
    userBannedId?: string;
    userBannedName: string;
    userBannedAvatar: string;
}

type BannedListProps = {
    meet: string;
};

export const BannedList: React.FC<BannedListProps> = ({ meet }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [banneds, setBanneds] = useState<Banned[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    const getBanneds = async () => {
        try {
            setIsLoading(true);
            const bannedsResult = await bannedServices.getBanneds();
            setBanneds(bannedsResult?.data);
            console.log("bannedResult", bannedsResult);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log("Erro ao carregar a lista de usuários banidos", error);
        }
    };

    const selectBanned = async (banned: any) => {
        try {
            console.log("selectBanned", banned);
            const resultSelect = await bannedServices.getBannedById(banned._id);
            console.log("resultSelect", resultSelect);
            setSelected(banned._id)
        } catch (error) {
            console.log("Erro ao selecionar usuário banido", error);
        }
    };

    const selectToRemove = (id: string) => {
        setSelected(id)
        setShowModal(true)
    }

    const cancelSelection = () => {
        setSelected(null);
        setShowModal(false);
    };

    const removeBanned = async () => {
        try {
            if(!selected){
                return
            }
            await bannedServices.deleteBannedById(selected)
            await getBanneds()
            cancelSelection()
        } catch (error) {
            console.log("Erro ao deletar usuário banido", error);
        }
    }

    useEffect(() => {
        getBanneds();
    }, []);

    return (
        <><div className="container-banned-list">
            {isLoading ? (
                <Loading />
            ) : (
                <div>
                    {banneds && banneds && banneds.length > 0 ? (
                        banneds.map((banned, index) => (
                            <div key={index}>
                                {meet === banned.meet ? (
                                    <BannedListItem
                                        banned={banned}
                                        selectBanned={selectBanned}
                                        meet={meet === banned.meet} 
                                        selectToRemove={selectToRemove}
                                        selected={selected || ""}/>
                                ) : (
                                    <div>
                                        <p className="banned-empty-name">Meet não possui usuários banidos</p>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div>
                            <p className="banned-empty-name">Meet não possui usuários banidos</p>
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
                            <span>Deletar Ban</span>
                            <p>Deseja deletar o ban do usuário</p>
                            <p>Essa ação não poderá ser desfeita</p>
                        </div>
                        <div className="actions">
                            <span onClick={cancelSelection}>Cancelar</span>
                            <button onClick={removeBanned}>Confirmar</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            </>
    );
};
