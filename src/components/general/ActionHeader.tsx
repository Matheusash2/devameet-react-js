import { useNavigate } from "react-router-dom";

export const ActionHeader = () => {

    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    }

    return (
        <div className="container-action-header">
            <span onClick={goBack}>Cancelar</span>
            <strong>Editar perfil</strong>
            <span className="principal">Concluir</span>
        </div>
    );
}