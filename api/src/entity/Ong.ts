import { Cidade } from "./Cidade";

export interface Ong {
    id: number;
    nome: string;
    endereco: string;
    telefone: string;
    email: string;
    atende?: Cidade[]
}
