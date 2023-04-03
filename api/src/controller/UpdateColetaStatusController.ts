import { UpdateColetaStatusService } from "../service/UpdateColetaStatusService";
import { Controller } from "./Controller";

export class UpdateColetaStatusController implements Controller {
    constructor(private readonly service: UpdateColetaStatusService) {}
    async handle(request: any): Promise<unknown> {
        try {
            const { coletaId, status } = request;

            const updatedStatusColeta = await this.service.run(
                coletaId,
                status
            );
            return {
                statusCode: 200,
                body: {
                    coleta: updatedStatusColeta,
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
