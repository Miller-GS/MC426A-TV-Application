import { ListLotesFornecedoresService } from "../service/ListLotesFornecedoresService";
import { Controller } from "./Controller";

export class ListLotesFornecedorController implements Controller {
    constructor(private readonly service: ListLotesFornecedoresService) {}
    async handle(request: any): Promise<unknown> {
        try {
            const { idFornecedor } = request;
            const batches = await this.service.run(idFornecedor);

            return {
                statusCode: 200,
                body: { lotes: batches },
            };
        } catch (err) {
            console.error(err);
            return {
                statusCode: 500,
                body: {
                    message: "internal error",
                },
            };
        }
    }
}
