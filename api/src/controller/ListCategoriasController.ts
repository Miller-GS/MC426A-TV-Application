import { query } from "../database";
import { ListCategoriasService } from "../service/ListCategoriasService";
import { Controller } from "./Controller";

export class ListCategoriasController implements Controller {
    constructor(private readonly service: ListCategoriasService) {}
    async handle(request: any): Promise<unknown> {
        try {
            const categories = await this.service.run();

            return {
                statusCode: 200,
                body: {
                    categorias: categories,
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
