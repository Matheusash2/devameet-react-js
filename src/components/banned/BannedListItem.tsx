import trashIcon from "../../assets/images/trash.svg";
import { AvatarUser } from "./AvatarUser";

type BannedListItemProps = {
    banned: any;
    meet: any;
    selected: string;
    selectBanned(banned: any): void;
    selectToRemove(id: string): void;
};

export const BannedListItem: React.FC<BannedListItemProps> = ({
    meet,
    banned,
    selected,
    selectBanned,
    selectToRemove,
}) => {
    console.log("selected", selected);
    console.log("banned.id", banned._id);
    return (
        <div className="container-banned-list-item">
            {meet && (
                <>
                    <div onClick={() => selectBanned(banned)}>
                        <AvatarUser image={banned.userBannedAvatar} />
                        <span className={selected === banned._id ? "selected" : ""}>{banned.userBannedName}</span>
                    </div>
                    <div>
                        <img alt="Deletar Banimento" src={trashIcon} onClick={() => selectToRemove(banned?._id)}/>
                    </div>
                </>
            )}
        </div>
    );
};
