import { query } from "../database";
import { Ong } from "../entity/Ong";

export class OngRepository {
    async get(ongId: number): Promise<Ong> {
        const ong = (await query(
            `SELECT * FROM ONG WHERE id_ong = ${ongId}`
        )) as any;

        return {
            id: ong[0].id_ong,
            nome: ong[0].nome,
            endereco: ong[0].endereco,
            email: ong[0].email,
            telefone: ong[0].telefone
        };
    }

    async save(ong: Ong): Promise<Ong> {
        const { insertId } = (await query(
            `INSERT INTO ONG (nome, endereco, telefone, email) values ('${ong.nome}', '${ong.endereco}', '${ong.telefone}', '${ong.email}')`
        )) as any;

        const createdOng = await this.get(Number(insertId))
        return createdOng;
    }
}
