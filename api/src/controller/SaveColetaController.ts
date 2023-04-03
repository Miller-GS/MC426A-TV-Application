import { SaveColetaService } from "../service/SaveColetaService";
import { Controller } from "./Controller";

export class SaveColetaController implements Controller {
    constructor(private readonly service: SaveColetaService){}

    async handle(request: any): Promise<unknown> {
        try {
            const { coleta, idOng, idLote } = request
            const createdColeta = await this.service.run(coleta, Number(idOng), Number(idLote))
            return {
                statusCode: 201,
                body: {
                    coleta: createdColeta
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