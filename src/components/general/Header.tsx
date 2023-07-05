import logo from "../../assets/images/logo.svg";
import homeIcon from "../../assets/images/home.svg";
import homeActiveIcon from "../../assets/images/home_active.svg";
import roomIcon from "../../assets/images/room.svg";
import roomActiveIcon from "../../assets/images/room_active.svg";
import avatarIcon from "../../assets/images/avatar.svg";
import { useLocation, useNavigate } from "react-router-dom";

export const Header = () => {
    
    const navigate = useNavigate();
    const location = useLocation();
    
    const getIcon = (name: string) => {
        switch(name) {
            case "home": 
                if (location.pathname !== '/user' && 
                    location.pathname !== '/link' &&
                    location.pathname !== '/room'){
                        return homeActiveIcon;
                }
                return homeIcon;
            case "room":
                if (location.pathname === '/room' || 
                    location.pathname === '/link'){
                        return roomActiveIcon;
                }
                return roomIcon;

            default: 
                return "";
        }    
    }

    const getSelectedClass = () => {
        if(location.pathname === '/user'){
            return 'selected';
        }
        return '';
    }
     
    return (
        <div className="container-header">
            <img src={logo} alt="Logo devameet" className="logo"/>
            <div className="navigation">
                <ul>
                    <li>
                        <img src={getIcon('home')} alt="Minhas reuniões" className="iconeNav" onClick={() => navigate('/')}/>
                    </li>
                    <li>
                        <img src={getIcon('room')} alt="Entrar na reunião" className="iconeNav" onClick={() => navigate('link')}/>
                    </li>
                    <li>
                        <div className={"avatar mini " + getSelectedClass()} onClick={() => navigate('user')}>
                            <img src={avatarIcon} alt="Editar usuário" />
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}