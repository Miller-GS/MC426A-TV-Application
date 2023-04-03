import { Produto } from "../entity/Produto";
import { ProdutosRepository } from "../repository/ProdutosRepository";

export class ListProdutosService {
    constructor(private readonly repository: ProdutosRepository) {}
    async run(): Promise<Produto[]> {
        const products = await this.repository.list();

        return products;
    }
}
