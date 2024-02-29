import React from "react";
import avatarIcon from "../../assets/images/avatar.svg";

type AvatarUserProp = {
    image: string;
};

export const AvatarUser: React.FC<AvatarUserProp> = ({ image }) => {
    const avatarImage = () => {
        if (image && image.trim().length > 0) {
            const path = `../../assets/objects/avatar/${image}_front.png`;
            const imageUrl = new URL(path, import.meta.url);
            return imageUrl.href;
        }
        return avatarIcon;
    };

    return (
        <div className="container-avatar-user">
            <img className="avatar-user" src={avatarImage()} />
        </div>
    );
};
