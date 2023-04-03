import { ListColetasFornecedorService } from "../service/ListColetasFornecedorService";
import { Controller } from "./Controller";

export class ListColetasFornecedorController implements Controller {
    constructor(private readonly service: ListColetasFornecedorService) {}

    async handle(request: any): Promise<unknown> {
        try {
            const { idFornecedor } = request;
            const coletas = await this.service.run(Number(idFornecedor));
            return {
                statusCode: 200,
                body: {
                    coletas,
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
