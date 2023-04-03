import { Coleta } from "../entity/Coleta";
import { ColetasRepository } from "../repository/ColetasRepository";

export class UpdateColetaStatusService {
    constructor(private readonly repository: ColetasRepository) {}
    async run(coletaId: number, status: string): Promise<Coleta> {
        const acceptedStatus = [
            "concluida",
            "cancelada",
            "aguardando",
            "reagendar",
        ];

        if (!acceptedStatus.includes(status)) status = "aguardando";

        await this.repository.updateStatus(coletaId, status);

        const updatedColeta = await this.repository.get(coletaId);

        return updatedColeta;
    }
}
