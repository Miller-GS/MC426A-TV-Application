import { Cidade } from "./Cidade";

export interface Fornecedor {
    id: number;
    nome: string;
    telefone: string;
    email: string;
    endereco: string;
    fornece?: Cidade[];
}
