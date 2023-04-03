import { ListCidadesService } from "../service/ListCidadesService";
import { Controller } from "./Controller";

export class ListCidadesController implements Controller {
    constructor(private readonly service: ListCidadesService) {}
    async handle(request: any): Promise<unknown> {
        try {
            const cities = await this.service.run();

            return {
                statusCode: 200,
                body: {
                    cidades: cities,
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
