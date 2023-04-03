import { ListColetasOngService } from "../service/ListColetasOngService";
import { Controller } from "./Controller";

export class ListColetasOngController implements Controller {
    constructor(private readonly service: ListColetasOngService){}

    async handle(request: any): Promise<unknown> {
        try {
            const { idOng } = request
            const coletas = await this.service.run(Number(idOng))
            return {
                statusCode: 200,
                body: {
                    coletas
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