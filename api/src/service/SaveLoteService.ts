import { Lote } from "../entity/Lote";
import { LotesRepository } from "../repository/LotesRepository";

export class SaveLoteService {
    constructor(private readonly repository: LotesRepository) {}
    async run(
        idFornecedor: string,
        idProduto: string,
        lote: any
    ): Promise<Lote> {
        const createdLoteId = await this.repository.save(
            parseInt(idFornecedor),
            parseInt(idProduto),
            lote
        );

        const createdLote = await this.repository.get(createdLoteId);

        return createdLote;
    }
}
