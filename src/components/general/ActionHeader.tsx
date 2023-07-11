import { useNavigate } from "react-router-dom";

type ActionHeaderProps = {
    actionCallback(): void,
    disabled: boolean
}

export const ActionHeader: React.FC<ActionHeaderProps> = ({ actionCallback, disabled }) => {

    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    }

    return (
        <div className="container-action-header">
            <span onClick={goBack}>Cancelar</span>
            <strong>Editar perfil</strong>
            {disabled
                ? <span className="disabled" >Concluir</span>
                : <span className="principal" onClick={actionCallback}>Concluir</span>}
        </div>
    );
}