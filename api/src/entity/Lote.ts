import { Fornecedor } from "./Fornecedor";
import { Produto } from "./Produto";

export interface Lote {
    id: number;
    quantidade: number;
    validade: Date;
    disponivel: boolean;
    fornecedor: Fornecedor;
    produto: Produto;
}
