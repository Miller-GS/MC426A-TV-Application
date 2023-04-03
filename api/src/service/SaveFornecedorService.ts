import { Fornecedor } from "../entity/Fornecedor";
import { Ong } from "../entity/Ong";
import { FornecedorRepository } from "../repository/FornecedorRepository";
import { OngRepository } from "../repository/OngRespository";

export class SaveFornecedorService {
    constructor(private readonly repository: FornecedorRepository) {}
    async run(fornecedor: Fornecedor): Promise<Ong> {
        const coletas = await this.repository.save(fornecedor);

        return coletas;
    }
}
