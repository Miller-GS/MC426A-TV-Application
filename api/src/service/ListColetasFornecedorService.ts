import { Cidade } from "../entity/Cidade";
import { Coleta } from "../entity/Coleta";
import { ColetasRepository } from "../repository/ColetasRepository";

export class ListColetasFornecedorService {
    constructor(private readonly repository: ColetasRepository) {}
    async run(idFornecedor: number): Promise<Coleta[]> {
        const coletas = await this.repository.listColetasFornecedor(idFornecedor);

        return coletas;
    }
}
