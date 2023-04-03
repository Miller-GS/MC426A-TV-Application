import { Controller } from "./Controller";

export class ListLotesRegiaoOngController implements Controller {
    async handle(request: any): Promise<unknown> {
        console.log("controller")
        return {
            statusCode: 200
        }
    };

}