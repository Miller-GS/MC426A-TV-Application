import { Cidade } from "../entity/Cidade";
import { CidadesRepository } from "../repository/CidadesRespository";

export class ListCidadesService {
    constructor(private readonly repository: CidadesRepository) {}
    async run(): Promise<Cidade[]> {
        const cities = await this.repository.list();

        return cities;
    }
}
