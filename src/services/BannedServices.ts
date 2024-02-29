import { HttpApiServices } from "./HttpApiServices";

export class BannedServices extends HttpApiServices {
    baseUrl = "/banned";

    async getBannedByMeet(meet: string) {
        return await this.get(this.baseUrl + "/" + meet);
    }

    async getBanneds() {
        return await this.get(this.baseUrl);
    }

    async getBannedById(id: string) {
        return await this.get(this.baseUrl + "/" + id);
    }

    async deleteBannedById(id: string) {
        return await this.delete(this.baseUrl + "/" + id);
    }

    async createBanned(body: any) {
        return await this.post(this.baseUrl, body);
    }
}