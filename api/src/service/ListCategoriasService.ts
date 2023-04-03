import { Categoria } from "../entity/Categoria";
import { CategoriasRepository } from "../repository/CategoriasRepository";

export class ListCategoriasService {
    constructor(private readonly repository: CategoriasRepository) {}
    async run(): Promise<Categoria[]> {
        const categories = await this.repository.list();

        return categories;
    }
}
