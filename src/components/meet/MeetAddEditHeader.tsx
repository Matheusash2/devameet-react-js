import { useState } from "react";
import arrowIcon from "../../assets/images/arrow_down_color.svg";
import { Modal } from "react-bootstrap";

type MeetAddEditHeaderProps = {
    name: string,
    setName(s: string): void,
    color: string,
    setColor(s: string): void
}

export const MeetAddEditHeader: React.FC<MeetAddEditHeaderProps> = ({ name, setName, color, setColor }) => {
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);

    const colors = [
        '#B0A4FF', 
        '#3BD42D',
        '#5E49FF',
        '#25CBD3',
        '#FFB0A4',
        '#D43B7D',
        '#D34D3B',
        '#D325CB',
        '#FFD6A4',
        '#3BD49D',
        '#4D3BD4',
        '#25D3AA',
        '#A4FFB0',
        '#7DD43B',
        '#D4D43B',
        '#D35E49',
        '#FFA4B0',
        '#3B7DD4',
        '#49FF5E',
        '#25D3CB'
    ]
     
    const selectColor = () => {
        if(selected) {
            setColor(selected);
        }

        setShowModal(false);
    }
    const cancelSelection = () => {
        setSelected(null);
        setShowModal(false);
    }

    return (
        <>
            <div className="container-user-header">
                <span>Nova reunião</span>
                <div>
                    <input
                        type="text" placeholder="Digite o nome de sua reunião"
                        value={name} onChange={e => setName(e.target.value)} />
                    <div className="color-select" onClick={() => setShowModal(true)}>
                        <div className="circle" style={color ? { backgroundColor: color } : {}} />
                        <img src={arrowIcon} alt="selecionar cor" />
                    </div>
                </div>
            </div>
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                className="container-modal">
                <Modal.Body>
                    <div className="content">
                        <div className="container">
                            <span>Selecione a cor da reunião:</span>
                            <div className="colors">
                                {colors?.map(c => <div className={c === selected ? 'selected' : ''} style={{backgroundColor: c}}
                                    onClick={() => setSelected(c)}/>)}
                            </div>
                        </div>
                        <div className="actions">
                            <span onClick={cancelSelection}>Cancelar</span>
                            <button onClick={selectColor}>Confirmar</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}