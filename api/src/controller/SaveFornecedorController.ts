import { SaveFornecedorService } from "../service/SaveFornecedorService";
import { Controller } from "./Controller";

export class SaveFornecedorController implements Controller {
    constructor(private readonly service: SaveFornecedorService){}

    async handle(request: any): Promise<unknown> {
        try {
            const { fornecedor } = request
            const createdFornecedor = await this.service.run(fornecedor)
            return {
                statusCode: 201,
                body: {
                    fornecedor: createdFornecedor
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