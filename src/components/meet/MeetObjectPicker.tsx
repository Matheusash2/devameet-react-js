import { useState } from "react";
import downIcon from "../../assets/images/arrow_down_object.svg";
import rightIcon from "../../assets/images/arrow_right_object.svg";
import addIcon from "../../assets/images/plus_circle.svg";
import addGreyIcon from "../../assets/images/plus_circle_grey.svg";

type MeetObjectPickerType = {
    image: string;
    label: string;
    asset: any;
    selected: string;
    setObject(s: any): void;
};

export const MeetObjectPicker: React.FC<MeetObjectPickerType> = ({
    image,
    label,
    asset,
    selected,
    setObject,
}) => {
    const [show, setShow] = useState(false);

    const getImageFromObject = (object: string) => {
        if (object && object.trim().length > 0) {
            const path = `../../assets/objects/${asset.path}/${object}${
                asset.canRotate ? "_front" : ""
            }.png`;
            const imageUrl = new URL(path, import.meta.url);
            return imageUrl.href;
        }
    };

    const selectObject = (o: string) => {
        const objectFinal = {
            name: o,
            x: asset.defaultXPosition,
            y: asset.defaultYPosition,
            zindex: asset.defaultZIndex,
            orientation: asset.canRotate ? "front" : "",
            type: asset.path,
            flexStart: asset.flexStart,
            selectMultiple: asset.selectMultiple,
        };

        setObject(objectFinal);
    };

    return (
        <div className="container-object-picker">
            <div className="action-picker" onClick={() => setShow(!show)}>
                <img src={image} alt={label} />
                <span>{label}</span>
                {!show ? <img src={downIcon} /> : <img src={rightIcon} />}
            </div>
            {show && (
                <div className="objects">
                    {asset?.objects?.map((o: any) => (
                        <div
                            className={o === selected ? "selected" : ""}
                            onClick={() => selectObject(o)}
                        >
                            <img
                                src={getImageFromObject(o)}
                                className={
                                    "object " +
                                    (asset.path === "wall" ||
                                    asset.path === "couch"
                                        ? "large"
                                        : "")
                                }
                            />
                            {selected === o ? (
                                <img src={addIcon} className="add" />
                            ) : (
                                <img src={addGreyIcon} className="add" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
