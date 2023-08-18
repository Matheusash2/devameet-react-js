import { HttpApiServices } from "./HttpApiServices";

export class UserServices extends HttpApiServices {
    async update(body: any) {
        return await this.put("/user", body);
    }
}
