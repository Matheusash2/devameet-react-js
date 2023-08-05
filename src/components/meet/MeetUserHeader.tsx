import { useEffect, useState } from "react";
import addIcon from "../../assets/images/add.svg";
import { useNavigate } from "react-router-dom";

type MeetUserHeaderProps = {
    isLink? : boolean,
}

export const MeetUserHeader: React.FC<MeetUserHeaderProps> = ({isLink}) => {

    const [mobile, setMobile] = useState(window.innerWidth <= 992);
    const name = localStorage.getItem('name') || '';
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setMobile(window.innerWidth <= 992);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const navigateToAdd = () => {
        navigate('/add');
    }

    return (
        <div className="container-user-header">
            <span>{isLink ? "Reunião" : "Minhas reuniões"}</span>
            <div>
                <p>Olá, {name}</p>
                {!mobile && <img src={addIcon} alt="Adicionar reunião" onClick={navigateToAdd} />}
            </div>
        </div>
    )
}