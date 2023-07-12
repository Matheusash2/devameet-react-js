import { MeetList } from "./MeetList";
import { MeetUserHeader } from "./MeetUserHeader";

export const MeetHome = () => {

    return( 
        <div className="container-principal">
            <div className="container-meet">
                <MeetUserHeader />
                <MeetList />
            </div>
        </div>
    );
}