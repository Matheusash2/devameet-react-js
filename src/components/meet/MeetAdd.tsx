import { MeetAddEditHeader } from "./MeetAddEditHeader";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MeetServices } from "../../services/MeetServices";
import { MeetObjectsroom } from "./MeetObjectsRoom";
import { Loading } from "../general/Loading";

const meetServices = new MeetServices();

export const MeetAdd = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [color, setColor] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const goBack = () => {
        return navigate(-1);
    };

    const isFormInvalid =
        !name || name.trim().length < 5 || !color || color.trim().length < 4;

    const doSave = async () => {
        try {
            setIsLoading(true);
            if (isFormInvalid) {
                return;
            }

            await meetServices.createMeet({ name, color });
            setIsLoading(false);
            return goBack();
        } catch (e: any) {
            setIsLoading(false);
            if (e?.response?.data?.message) {
                console.log(
                    "Erro ao criar reunião:",
                    e?.response?.data?.message
                );
            } else {
                console.log("Erro ao criar reunião:", e);
            }
        }
    };

    return (
        <div className="container-principal">
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <div className="container-meet">
                        <MeetAddEditHeader
                            isEdit={false}
                            name={name}
                            setName={setName}
                            color={color}
                            setColor={setColor}
                        />
                        <div className="form">
                            <span onClick={goBack}>Voltar</span>
                            <button
                                onClick={doSave}
                                disabled={isFormInvalid}
                                className={isFormInvalid ? "disabled" : ""}
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                    <MeetObjectsroom />
                </>
            )}
        </div>
    );
};
