import React, { useState } from "react";

import linkPreviewIcon from "../../assets/images/link_preview.svg"

type RoomObjectsProps = {
    objects: Array<any>,
    enterRoom(): void,
};

export const RoomObjects: React.FC<RoomObjectsProps> = ({ objects, enterRoom }) => {

    const [objectsWithWidth, setObjectsWithWidth] = useState<Array<any>>([]);
    const mobile = window.innerWidth <= 992;

    const getImageFromObject = (object: any) => {
        if (object && object._id) {
            const path = `../../assets/objects/${object?.type}/${object.name}${object.orientation ? "_" + object.orientation : ""}.png`;
            const imageUrl = new URL(path, import.meta.url);

            if(mobile) {
                let img = new Image();
                img.onload = () => {
                    const exist = objectsWithWidth.find((o: any) => o.name == object.name);
                    if(!exist) {
                        const newObjects = [...objectsWithWidth, {name: object.name, width: img.width}];
                        setObjectsWithWidth(newObjects);
                    }
                }
                img.src = imageUrl.href;
            }
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

        switch (object.y) {
            case 0: {
                style += "row-one "
                break;
            }
            case 1: {
                style += "row-two "
                break;
            }
            case 2: {
                style += "row-three "
                break;
            }
            case 3: {
                style += "row-four "
                break;
            }
            case 4: {
                style += "row-five "
                break;
            }
            case 5: {
                style += "row-six "
                break;
            }
            case 6: {
                style += "row-seven "
                break;
            }
            case 7: {
                style += "row-eight "
                break;
            }
            default:
                break;
        }
        switch (object.x) {
            case 0: {
                style += "column-one "
                break;
            }
            case 1: {
                style += "column-two "
                break;
            }
            case 2: {
                style += "column-three "
                break;
            }
            case 3: {
                style += "column-four "
                break;
            }
            case 4: {
                style += "column-five "
                break;
            }
            case 5: {
                style += "column-six "
                break;
            }
            case 6: {
                style += "column-seven "
                break;
            }
            case 7: {
                style += "column-eight "
                break;
            }
            default:
                break;
        }

        if (object.type === 'couch' && (object.orientation === "right" || object.orientation === "left")) {
            style += ' rotated';
        }

        return style;
    }

    return (
        <div className="container-objects">
            <div className="center">
                <div className="grid">
                    {
                        objects?.map((object: any) =>
                            <img key={object._id}
                                src={getImageFromObject(object)}
                                className={getClassFromObject(object)}
                                style={{ zIndex: object.zindex }}
                            />)
                    }
                    <div className="preview">
                        <img src={linkPreviewIcon} alt="Entrar na sala"/>
                        <button onClick={enterRoom}>Entrar na sala</button>
                    </div>
                </div>
            </div>
        </div>
    );
}