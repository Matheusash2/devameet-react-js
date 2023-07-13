import { MeetAddEditHeader } from "./MeetAddEditHeader";
import trashIcon from "../../assets/images/trash_object.svg";
import rotateRightIcon from "../../assets/images/rotate_right.svg";
import rotateLeftIcon from "../../assets/images/rotate_left.svg";

export const MeetAdd = () => {

    return (
        <div className="container-principal">
            <div className="container-meet">
                <MeetAddEditHeader />
            </div>
            <div className="container-objects">
                <div className="center">
                    <div className="grid">

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