import { useState } from "react";
import { MeetAddEditHeader } from "./MeetAddEditHeader";
import { useNavigate } from "react-router-dom";
import { MeetObjectPicker } from "./MeetObjectPicker";
import objectsJson from "../../assets/objects/objects.json";
import wallIcon from "../../assets/images/wall.svg";
import floorIcon from "../../assets/images/floor.svg";
import rugIcon from "../../assets/images/rug.svg";
import tableIcon from "../../assets/images/table.svg";
import chairIcon from "../../assets/images/chair.svg";
import couchIcon from "../../assets/images/couch.svg";
import decorIcon from "../../assets/images/decor.svg";
import natureIcon from "../../assets/images/nature.svg";

export const MeetEdit = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [color, setColor] = useState('');
    const [selected, setSelected] = useState('');

    const goBack = () => {
        return navigate(-1);
    }

    const isFormInvalid = true;

    const doSave = async () => {

    }

    return (
        <div className="container-principal">
            <div className="container-meet">
                <MeetAddEditHeader isEdit={true}
                    name={name} setName={setName}
                    color={color} setColor={setColor}
                />
                <div className="scroll">
                    <MeetObjectPicker asset={objectsJson.wall} label="Paredes" image={wallIcon} selected={selected} setObject={setSelected} />
                    <MeetObjectPicker asset={objectsJson.floor} label="Pisos" image={floorIcon} selected={selected} setObject={setSelected} />
                    <MeetObjectPicker asset={objectsJson.rug} label="Tapetes" image={rugIcon} selected={selected} setObject={setSelected} />
                    <MeetObjectPicker asset={objectsJson.table} label="Mesas" image={tableIcon} selected={selected} setObject={setSelected} />
                    <MeetObjectPicker asset={objectsJson.chair} label="Cadeiras" image={chairIcon} selected={selected} setObject={setSelected} />
                    <MeetObjectPicker asset={objectsJson.couch} label="Sofás" image={couchIcon} selected={selected} setObject={setSelected} />
                    <MeetObjectPicker asset={objectsJson.decor} label="Decorações" image={decorIcon} selected={selected} setObject={setSelected} />
                    <MeetObjectPicker asset={objectsJson.nature} label="Plantas" image={natureIcon} selected={selected} setObject={setSelected} />
                </div>
                <div className="form">
                    <span onClick={goBack}>Voltar</span>
                    <button onClick={doSave}
                        disabled={isFormInvalid}
                        className={isFormInvalid ? 'disabled' : ''}>Salvar</button>
                </div>
            </div>
        </div>
    );
}