import editIcon from "../../assets/images/edit.svg";
import copyIcon from "../../assets/images/copy.svg";
import trashIcon from "../../assets/images/trash.svg";
import roomMobileIcon from "../../assets/images/room_mobile.svg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type MeetListItemProps = {
    meet: any,
    selected: string,
    selectMeet(meet: any): void,
    selectToRemove(id: string): void
}

export const MeetListItem: React.FC<MeetListItemProps> = ({ meet, selectToRemove, selectMeet, selected }) => {

    const [mobile, setMobile] = useState(window.innerWidth <= 992)

    useEffect(() => {
        const handleResize = () => {
            setMobile(window.innerWidth <= 992);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const navigate = useNavigate();

    const goToRoom = () => {
        navigate('/room/' + meet?.link);
    }

    const goToEdit = () => {
        navigate('/edit/' + meet?.id);
    }

    const copyLink = () => {
        navigator.clipboard.writeText(window?.location?.href + 'room/' + meet?.link);
    }

    return (
        <div className="container-meet-list-item">
            <div className="meet" onClick={() => selectMeet(meet)}>
                <div className="color" style={{ backgroundColor: meet.color }} />
                <span className={selected === meet?.id ? "selected" : ""}>{meet.name}</span>
            </div>
            <div className="actions">
                {mobile && <img src={roomMobileIcon} alt="entrar na reunião" onClick={goToRoom} />}
                <img src={copyIcon} alt="copiar link da reunião" onClick={copyLink} />
                {!mobile && <img src={editIcon} alt="editar reunião" onClick={goToEdit} />}
                <img src={trashIcon} alt="deletar reunião" onClick={() => selectToRemove(meet?.id)} />
            </div>
        </div>
    );
}