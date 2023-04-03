import { SaveOngService } from "../service/SaveOngService";
import { Controller } from "./Controller";

export class SaveOngController implements Controller {
    constructor(private readonly service: SaveOngService){}

    async handle(request: any): Promise<unknown> {
        try {
            const { ong } = request
            const createdOng = await this.service.run(ong)
            return {
                statusCode: 201,
                body: {
                    ong: createdOng
                }
            }
        } catch(err) {
            console.log(err);
            return {
                statusCode: 500,
                body: {
                    message: "internal error"
                }
            }
        }
    };

}