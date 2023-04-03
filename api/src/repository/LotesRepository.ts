import { query } from "../database";
import { Fornecedor } from "../entity/Fornecedor";
import { Lote } from "../entity/Lote";
import { Produto } from "../entity/Produto";
import { asyncForEach } from "../util/AsyncForEach";
import { CategoriasRepository } from "./CategoriasRepository";

export class LotesRepository {
    async get(loteId: number) {
        const batches: Lote[] = (await query(
            `SELECT
                id_lote as id,
                quantidade,
                validade,
                disponivel = 1 as disponivel,
                id_fornecedor as fornecedor,
                id_produto as produto
            FROM
                Lote
            WHERE
                id_lote = ?
        `,
            [loteId]
        )) as Lote[];

        await this.fillProductsAndProvider(batches);

        return batches[0];
    }

    async listPerProvider(providerId: number): Promise<Lote[]> {
        const batches: Lote[] = (await query(
            `SELECT
                id_lote as id,
                quantidade,
                validade,
                disponivel = 1 as disponivel,
                id_fornecedor as fornecedor,
                id_produto as produto
            FROM
                Lote
            WHERE
                id_fornecedor = ?
        `,
            [providerId]
        )) as Lote[];

        await this.fillProductsAndProvider(batches);

        return batches;
    }

    async fillProductsAndProvider(batches: Lote[]) {
        await asyncForEach(batches, async (batch: any) => {
            batch.disponivel = batch.disponivel === 1;

            const providerQueryResult = (await query(
                `SELECT
                    id_fornecedor as id,
                    nome,
                    telefone,
                    endereco,
                    email
                FROM
                    Fornecedor
                WHERE
                    id_fornecedor = ?`,
                [batch.fornecedor]
            )) as any[];

            batch.fornecedor = providerQueryResult[0];

            const productsQueryResult = (await query(
                `SELECT
                    id_produto as id,
                    nome,
                    vida_util as vidaUtil,
                    id_categoria as categoria
                FROM
                    Produto
                WHERE
                    id_produto = ?`,
                [batch.produto]
            )) as any[];

            batch.produto = productsQueryResult[0];
            batch.produto.categoria = await CategoriasRepository.get(
                batch.produto.categoria
            );
        });
    }

    async save(idFornecedor: number, idProduto: number, lote: any) {
        const { insertId } = (await query(
            `INSERT
                INTO
                Lote (quantidade,
                validade,
                disponivel,
                id_fornecedor,
                id_produto)
            VALUES (?,
                ?,
                1,
                ?,
                ?)`,
            [lote.quantidade, lote.validade, idFornecedor, idProduto]
        )) as any;

        return insertId;
    }
}
