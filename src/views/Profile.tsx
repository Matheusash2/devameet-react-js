import { useEffect, useState } from "react";
import { ActionHeader } from "../components/general/ActionHeader";
import { AvatarInput } from "../components/general/AvatarInput";
import { Footer } from "../components/general/Footer";
import { Header } from "../components/general/Header";
import clearIcon from "../assets/images/clear.svg";
import logoutIcon from "../assets/images/logout.svg";

export const Profile = () => {

    const [image, setImage] = useState('');
    const [mobile, setMobile] = useState(window.innerWidth <= 992);

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth <= 992);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

    return (
        <>
           {!mobile && <Header />}
            <div className="container-profile">
                <ActionHeader />
                <AvatarInput image={image} setImage={setImage}/>
                <div className="input">
                    <div>
                        <span>Nome</span>
                        <input type="text" placeholder="Informe seu nome" />
                        <img src={clearIcon} alt="Limpar"/>
                    </div>
                </div>
                <div className="logout">
                    <div>
                        <img src={logoutIcon} alt="Sair"/>
                        <span>Sair</span>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}