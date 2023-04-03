import { query } from "../database";
import { Categoria } from "../entity/Categoria";

export class CategoriasRepository {
    async list(): Promise<Categoria[]> {
        const categories = (await query(
            "SELECT id_categoria as id, rotulo, perecivel from Categoria ORDER BY rotulo ASC"
        )) as any;

        return categories.map((categoria: any) => {
            return {
                id: categoria.id,
                rotulo: categoria.rotulo,
                perecivel: Boolean(categoria.perecivel[0]),
            };
        });
    }

    static async get(categoryId: number): Promise<Categoria> {
        const categories = (await query(
            `SELECT
                id_categoria as id,
                rotulo,
                perecivel = 1 as perecivel 
            FROM
                Categoria
            WHERE
                id_categoria = ?`,
            [categoryId]
        )) as any;

        categories[0].perecivel = categories[0].perecivel === 1;

        return categories[0];
    }
}
