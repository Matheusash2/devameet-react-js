import { useState } from "react";
import { MeetAddEditHeader } from "./MeetAddEditHeader";
import { useNavigate } from "react-router-dom";
import { MeetObjectPicker } from "./MeetObjectPicker";
import { MeetObjectsroom } from "./MeetObjectsRoom";
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
    const [index, setIndex] = useState(0);
    const [name, setName] = useState('');
    const [color, setColor] = useState('');
    const [selected, setSelected] = useState<any>({});
    const [objects, setObjects] = useState<any>([]);

    const setObject = (object: any) => {
        const newIndex = index + 1;
        object._id = newIndex;
        setIndex(newIndex);

        if(object.selectMultiple === true){
            const newArray =[...objects, object];
            setObjects(newArray);
        }else{
            const filtered = objects.filter((o: any) => o.type !== object.type);
            filtered.push(object);
            setObjects(filtered);
        }

        setSelected(object);
    }

    const removeObject = (object: any) => {
        const filtered = objects.filter((o: any) => o._id !== object._id);
        setObjects(filtered);
        setSelected(null);
    }

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
                    <MeetObjectPicker asset={objectsJson.wall} label="Paredes" image={wallIcon} selected={selected?.name} setObject={setObject} />
                    <MeetObjectPicker asset={objectsJson.floor} label="Pisos" image={floorIcon} selected={selected?.name} setObject={setObject} />
                    <MeetObjectPicker asset={objectsJson.rug} label="Tapetes" image={rugIcon} selected={selected?.name} setObject={setObject} />
                    <MeetObjectPicker asset={objectsJson.table} label="Mesas" image={tableIcon} selected={selected?.name} setObject={setObject} />
                    <MeetObjectPicker asset={objectsJson.chair} label="Cadeiras" image={chairIcon} selected={selected?.name} setObject={setObject} />
                    <MeetObjectPicker asset={objectsJson.couch} label="Sofás" image={couchIcon} selected={selected?.name} setObject={setObject} />
                    <MeetObjectPicker asset={objectsJson.decor} label="Decorações" image={decorIcon} selected={selected?.name} setObject={setObject} />
                    <MeetObjectPicker asset={objectsJson.nature} label="Plantas" image={natureIcon} selected={selected?.name} setObject={setObject} />
                </div>
                <div className="form">
                    <span onClick={goBack}>Voltar</span>
                    <button onClick={doSave}
                        disabled={isFormInvalid}
                        className={isFormInvalid ? 'disabled' : ''}>Salvar</button>
                </div>
            </div>
            <MeetObjectsroom objects={objects} selected={selected} setSelected={setSelected} removeObject={removeObject}/>
        </div>
    );
}