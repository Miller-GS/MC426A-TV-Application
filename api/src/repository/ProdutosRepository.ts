import { query } from "../database";
import { Produto } from "../entity/Produto";

export class ProdutosRepository {
    async list(): Promise<Produto[]> {
        const products = (await query(`SELECT
            p.id_produto as id,
            p.nome,
            p.vida_util as vidaUtil,
            p.id_categoria as idCategoria,
            c.perecivel = 1 as perecivel,
            c.rotulo
        FROM
            Produto p
        JOIN Categoria c ON
            p.id_categoria = c.id_categoria`)) as any[];

        products.forEach((product) => {
            product.categoria = {};

            product.categoria.id = product.idCategoria;
            delete product.idCategoria;

            product.categoria.perecivel = product.perecivel === 1;
            delete product.perecivel;

            product.categoria.rotulo = product.rotulo;
            delete product.rotulo;
        });

        return products;
    }
}
