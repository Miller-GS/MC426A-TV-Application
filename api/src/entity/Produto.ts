import { Categoria } from "./Categoria";

export interface Produto {
    id: number;
    nome: string;
    vidaUtil: number;
    categoria: Categoria;
}
