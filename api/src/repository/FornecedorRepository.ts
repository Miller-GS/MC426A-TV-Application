import { query } from "../database";
import { Fornecedor } from "../entity/Fornecedor";

export class FornecedorRepository {
    async get(fornecedorId: number): Promise<Fornecedor> {
        const fornecedor = (await query(
            `SELECT * FROM Fornecedor WHERE id_fornecedor = ${fornecedorId}`
        )) as any;

        return {
            id: fornecedor[0].id_fornecedor,
            nome: fornecedor[0].nome,
            endereco: fornecedor[0].endereco,
            email: fornecedor[0].email,
            telefone: fornecedor[0].telefone
        };
    }

    async save(fornecedor: Fornecedor): Promise<Fornecedor> {
        const { insertId } = (await query(
            `INSERT INTO Fornecedor (nome, endereco, telefone, email) values ('${fornecedor.nome}', '${fornecedor.endereco}', '${fornecedor.telefone}', '${fornecedor.email}')`
        )) as any;

        const createdFornecedor = await this.get(Number(insertId))
        return createdFornecedor;
    }
}
