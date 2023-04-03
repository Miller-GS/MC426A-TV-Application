import { Coleta } from "../entity/Coleta";
import { ColetasRepository } from "../repository/ColetasRepository";

export class SaveColetaService {
    constructor(private readonly repository: ColetasRepository) {}
    async run(coleta: Coleta, idOng: number, idLote: number): Promise<Coleta> {
        const createdColeta = await this.repository.save(coleta, idOng, idLote);

        return createdColeta;
    }
}
