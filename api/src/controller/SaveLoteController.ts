import { SaveLoteService } from "../service/SaveLoteService";
import { Controller } from "./Controller";

export class SaveLoteController implements Controller {
    constructor(private readonly service: SaveLoteService) {}

    async handle(request: any): Promise<unknown> {
        try {
            const { idFornecedor, idProduto, lote } = request;
            const createdLote = await this.service.run(
                idFornecedor,
                idProduto,
                lote
            );
            return {
                statusCode: 201,
                body: {
                    lote: createdLote,
                },
            };
        } catch (err) {
            console.log(err);
            return {
                statusCode: 500,
                body: {
                    message: "internal error",
                },
            };
        }
    }
}
