import { Cidade } from "../entity/Cidade";
import { Coleta } from "../entity/Coleta";
import { ColetasRepository } from "../repository/ColetasRepository";

export class ListColetasOngService {
    constructor(private readonly repository: ColetasRepository) {}
    async run(idColeta: number): Promise<Coleta[]> {
        const coletas = await this.repository.listColetasOng(idColeta);

        return coletas;
    }
}
