import { ListProdutosService } from "../service/ListProdutosService";
import { Controller } from "./Controller";

export class ListProdutosController implements Controller {
    constructor(private readonly service: ListProdutosService) {}
    async handle(request: any): Promise<unknown> {
        try {
            const products = await this.service.run();

            return {
                statusCode: 200,
                body: {
                    produtos: products,
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
