import { query } from "../database";
import { Coleta } from "../entity/Coleta";
import { Lote } from "../entity/Lote";
import { Ong } from "../entity/Ong";

export class ColetasRepository {
    async get(coletaId: number): Promise<Coleta> {
        const coleta = (await query(
            `SELECT
                co.id_lote as id_lote,
                co.id_ong as id_ong,
                p.id_produto,
                p.nome as nome_produto,
                p.vida_util,
                p.id_categoria,
                l.quantidade,
                l.validade,
                l.disponivel = 1 as disponivel,
                l.id_fornecedor,
                co.data_coleta,
                co.status_coleta,
                o.nome as ong,
                o.endereco,
                o.telefone,
                o.email
            FROM
                Coleta co
            INNER JOIN Lote l ON
                l.id_lote = co.id_lote
            INNER JOIN ONG o ON
                o.id_ong = co.id_ong
            INNER JOIN Produto p ON
                p.id_produto = l.id_produto
            WHERE
                co.id_coleta = ${coletaId}
            ORDER BY
                co.data_coleta ASC`
        )) as any[];

        console.log(coleta);

        return {
            id: coletaId,
            data: coleta[0].data_coleta,
            status: coleta[0].status_coleta,
            ong: {
                id: coleta[0].id_ong,
                nome: coleta[0].ong,
                endereco: coleta[0].endereco,
                telefone: coleta[0].telefone,
                email: coleta[0].email,
            },
            lote: {
                id: coleta[0].id_lote,
                validade: coleta[0].validade,
                quantidade: coleta[0].quantidade,
                disponivel: coleta[0].disponivel === 1,
                fornecedor: coleta[0].id_fornecedor,
                produto: {
                    id: coleta[0].id_produto,
                    nome: coleta[0].nome_produto,
                    vidaUtil: coleta[0].vida_util,
                    categoria: coleta[0].id_categoria,
                },
            },
        };
    }

    async save(coleta: Coleta, idOng: number, idLote: number): Promise<Coleta> {
        const { insertId } = (await query(
            `INSERT INTO Coleta (id_lote, id_ong, data_coleta, status_coleta) values ('${idLote}', '${idOng}', '${coleta.data}', 'aguardando')`
        )) as any;

        const createdColeta = await this.get(Number(insertId));
        return createdColeta;
    }

    async updateStatus(coletaId: number, status: string) {
        const queryResult = (await query(
            `UPDATE
                Coleta
            SET
                status_coleta = ?
            WHERE
                id_coleta = ?`,
            [status, coletaId]
        )) as any;
    }

    async listColetasFornecedor(idFornecedor: number): Promise<Coleta[]> {
        const coletas = (await query(
            `SELECT     co.id_lote as id_lote,
                        co.id_ong as id_ong,
                        p.nome as nome_produto,
                        l.quantidade,
                        l.validade,
                        co.data_coleta,
                        co.status_coleta,
                        o.nome as ong,
                        o.endereco,
                        o.telefone,
                        o.email
            FROM Coleta co
            INNER JOIN Lote l ON l.id_lote = co.id_lote
            INNER JOIN ONG o ON o.id_ong = co.id_ong
            INNER JOIN Produto p ON p.id_produto = l.id_produto
            WHERE l.id_fornecedor = ${idFornecedor}
            ORDER BY co.data_coleta ASC`
        )) as any;

        return coletas.map((coleta: any) => {
            return {
                data: coleta.data_coleta,
                status: coleta.status_coleta,
                ong: {
                    id: coleta.id_ong,
                    nome: coleta.ong,
                    endereco: coleta.endereco,
                    telefone: coleta.telefone,
                    email: coleta.email,
                },
                lote: {
                    id: coleta.id_lote,
                    validade: coleta.validade,
                    produto: {
                        nome: coleta.nome_produto,
                    },
                },
            };
        });
    }

    async listColetasOng(idOng: number): Promise<Coleta[]> {
        const coletas = (await query(
            `SELECT     co.id_lote as id_lote,
                        co.id_ong as id_ong,
                        p.nome as nome_produto,
                        l.quantidade,
                        l.validade,
                        co.data_coleta,
                        co.status_coleta,
                        co.id_ong,
                        f.nome as fornecedor,
                        f.endereco,
                        f.telefone,
                        f.email
            FROM Coleta co
            INNER JOIN Lote l ON l.id_lote = co.id_lote
            INNER JOIN Fornecedor f ON f.id_fornecedor = l.id_fornecedor
            INNER JOIN Produto p ON p.id_produto = l.id_produto
            WHERE co.id_ong = ${idOng}
            ORDER BY co.data_coleta ASC`
        )) as any;

        return coletas.map((coleta: any) => {
            return {
                data: coleta.data_coleta,
                status: coleta.status_coleta,
                ong: {
                    id: coleta.id_ong,
                },
                lote: {
                    id: coleta.id_lote,
                    validade: coleta.validade,
                    produto: {
                        nome: coleta.nome_produto,
                    },
                    fornecedor: {
                        nome: coleta.fornecedor,
                        telefone: coleta.telefone,
                        endereco: coleta.endereco,
                        email: coleta.email,
                    },
                },
            };
        });
    }
}
