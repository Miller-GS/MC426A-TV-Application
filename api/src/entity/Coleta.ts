import { Lote } from "./Lote";
import { Ong } from "./Ong";

export interface Coleta {
    id: number;
    lote: Lote;
    ong: Ong;
    data: Date;
    status: string;
}
