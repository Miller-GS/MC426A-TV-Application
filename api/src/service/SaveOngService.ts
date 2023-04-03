import { Ong } from "../entity/Ong";
import { OngRepository } from "../repository/OngRespository";

export class SaveOngService {
    constructor(private readonly repository: OngRepository) {}
    async run(ong: Ong): Promise<Ong> {
        const createdOng = await this.repository.save(ong);

        return createdOng;
    }
}
