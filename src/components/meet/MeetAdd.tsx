import { MeetAddEditHeader } from "./MeetAddEditHeader";
import trashIcon from "../../assets/images/trash_object.svg";
import rotateRightIcon from "../../assets/images/rotate_right.svg";
import rotateLeftIcon from "../../assets/images/rotate_left.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MeetServices } from "../../services/MeetServices";

const meetServices = new MeetServices();

export const MeetAdd = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [color, setColor] = useState('');

    const goBack = () => {
        return navigate(-1);
    }

    const isFormInvalid = (
        !name || name.trim().length < 5 ||
        !color || color.trim().length < 4
    );

    const doSave = async () => {
        try {
            if (isFormInvalid) {
                return;
            }
            
            await meetServices.createMeet({ name, color });
            return goBack();
        } catch (e: any) {
            if (e?.response?.data?.message) {
                console.log('Erro ao criar reunião:', e?.response?.data?.message);
            } else {
                console.log('Erro ao criar reunião:', e);
            }
        }
    }

    return (
        <div className="container-principal">
            <div className="container-meet">
                <MeetAddEditHeader isEdit={false}
                    name={name} setName={setName}
                    color={color} setColor={setColor}
                />
                <div className="form">
                    <span onClick={goBack}>Voltar</span>
                    <button onClick={doSave} 
                        disabled={isFormInvalid}
                        className={isFormInvalid ? 'disabled' : ''}>Salvar</button>
                </div>
            </div>
            <div className="container-objects">
                <div className="center">
                    <div className="grid">
                        <div className="line row one" />
                        <div className="line row two" />
                        <div className="line row three" />
                        <div className="line row four" />
                        <div className="line row five" />
                        <div className="line row six" />
                        <div className="line row seven" />
                        <div className="line column one" />
                        <div className="line column two" />
                        <div className="line column three" />
                        <div className="line column four" />
                        <div className="line column five" />
                        <div className="line column six" />
                        <div className="line column seven" />
                    </div>
                    <div className="actions">
                        <div>
                            <img src={trashIcon} alt="Excluir" />
                        </div>
                        <div>
                            <img src={rotateRightIcon} alt="Girar para direita" />
                        </div>
                        <div>
                            <img src={rotateLeftIcon} alt="Girar para esquerda" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}