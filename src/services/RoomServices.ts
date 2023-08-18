import { HttpApiServices } from "./HttpApiServices";

export class RoomServices extends HttpApiServices {
    async getRoomByLink(link: string) {
        return await this.get("/room/" + link);
    }
}
