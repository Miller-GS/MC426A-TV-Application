import { Lote } from "../entity/Lote";
import { LotesRepository } from "../repository/LotesRepository";

export class ListLotesFornecedoresService {
    constructor(private readonly repository: LotesRepository) {}
    async run(requestProviderId: string): Promise<Lote[]> {
        const providerId = parseInt(requestProviderId, 10);

        const batches = await this.repository.listPerProvider(providerId);

        return batches;
    }
}
