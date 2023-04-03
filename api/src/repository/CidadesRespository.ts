import { query } from "../database";
import { Cidade } from "../entity/Cidade";

export class CidadesRepository {
    async list(): Promise<Cidade[]> {
        const cities: Cidade[] = (await query(
            "SELECT id_cidade as id, nome, estado FROM Cidade"
        )) as Cidade[];

        return cities;
    }
}
