import trashIcon from "../../assets/images/trash_object.svg";
import rotateRightIcon from "../../assets/images/rotate_right.svg";
import rotateLeftIcon from "../../assets/images/rotate_left.svg";

type MeetObjectsRoomType = {
    objects?:[],
    selected?: any,
    setSelected?(s: any): void,
    removeObject?(o: any): void,
}

export const MeetObjectsroom: React.FC<MeetObjectsRoomType> = ({objects, selected, setSelected, removeObject}) => {

    const getImageFromObject = (object: any) => {
        if (object && object._id) {
            const path = `../../assets/objects/${object?.type}/${object.name}${object.orientation? "_"+ object.orientation : ""}.png`;
            const imageUrl = new URL(path, import.meta.url);
            return imageUrl.href;
        }
    }

    const getClassFromObject = (object: any) => {
        let style = "";

        if (object.type === 'wall') {
            style += "wall-object ";

        } else if (object.type === 'floor') {
            style += "floor-object ";

        } else if (object.type === 'rug') {
            style += "rug-object ";
            
        } else if (object.type === 'table') {
            style += "table-object ";
            
        } else if (object.type === 'chair') {
            style += "chair-object ";
            
        } else if (object.type === 'couch') {
            style += "couch-object ";
            
        } else if (object.type === 'decor') {
            style += "decor-object ";
            
        } else if (object.type === 'nature') {
            style += "nature-object ";
            
        }

        switch(object.y) {
            case 0: {
                style += "row-one"
                break;
            }
            case 1: {
                style += "row-two"
                break;
            }
            case 2: {
                style += "row-three"
                break;
            }
            case 3: {
                style += "row-four"
                break;
            }
            case 4: {
                style += "row-five"
                break;
            }
            case 5: {
                style += "row-six"
                break;
            }
            case 6: {
                style += "row-seven"
                break;
            }
            default:
                break;
        }
        switch(object.x) {
            case 0: {
                style += "column-one"
                break;
            }
            case 1: {
                style += "column-two"
                break;
            }
            case 2: {
                style += "column-three"
                break;
            }
            case 3: {
                style += "column-four"
                break;
            }
            case 4: {
                style += "column-five"
                break;
            }
            case 5: {
                style += "column-six"
                break;
            }
            case 6: {
                style += "column-seven"
                break;
            }
            default:
                break;
        }

        if (object.name === selected?.name) {
            style += ' selected'
        }

        return style; 
    }

    return (
        <div className="container-objects">
        <div className="center">
            <div className="grid">
                <div className="line row one" />
                <div className="line row two" />
                <div className="line row three" />
                <div className="line row four" />
                <div className="line row five" />
                <div className="line row six" />
                <div className="line row seven" />
                <div className="line column one" />
                <div className="line column two" />
                <div className="line column three" />
                <div className="line column four" />
                <div className="line column five" />
                <div className="line column six" />
                <div className="line column seven" />
                {objects?.map((object: any) => 
                    <img key={object._id}
                        onClick={() => selected?.name === object.name ? setSelected!!(null) : setSelected!!(object)} 
                        src={getImageFromObject(object)}
                        className={getClassFromObject(object)}
                    />)}
            </div>
            <div className="actions">
                <div className={selected?._id ? "active" : ""}>
                    <img src={trashIcon} onClick={() => selected?._id ? removeObject!!(selected) : null} alt="Excluir" />
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
    );
}