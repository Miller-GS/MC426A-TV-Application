import express, { Router } from "express";
import { ListCategoriasController } from "./src/controller/ListCategoriasController";
import { ListCidadesController } from "./src/controller/ListCidadesController";
import { ListColetasFornecedorController } from "./src/controller/ListColetasFornecedorController";
import { ListColetasOngController } from "./src/controller/ListColetasOngController";
import { ListLotesFornecedorController } from "./src/controller/ListLotesFornecedorController";
import { ListProdutosController } from "./src/controller/ListProdutosController";
import { SaveColetaController } from "./src/controller/SaveColetaController";
import { SaveFornecedorController } from "./src/controller/SaveFornecedorController";
import { SaveLoteController } from "./src/controller/SaveLoteController";
import { SaveOngController } from "./src/controller/SaveOngController";
import { UpdateColetaStatusController } from "./src/controller/UpdateColetaStatusController";
import { CategoriasRepository } from "./src/repository/CategoriasRepository";
import { CidadesRepository } from "./src/repository/CidadesRespository";
import { ColetasRepository } from "./src/repository/ColetasRepository";
import { FornecedorRepository } from "./src/repository/FornecedorRepository";
import { LotesRepository } from "./src/repository/LotesRepository";
import { OngRepository } from "./src/repository/OngRespository";
import { ProdutosRepository } from "./src/repository/ProdutosRepository";
import { adaptRoute } from "./src/RouterAdapter";
import { ListCategoriasService } from "./src/service/ListCategoriasService";
import { ListCidadesService } from "./src/service/ListCidadesService";
import { ListColetasFornecedorService } from "./src/service/ListColetasFornecedorService";
import { ListColetasOngService } from "./src/service/ListColetasOngService";
import { ListLotesFornecedoresService } from "./src/service/ListLotesFornecedoresService";
import { ListProdutosService } from "./src/service/ListProdutosService";
import { SaveColetaService } from "./src/service/SaveColetaService";
import { SaveFornecedorService } from "./src/service/SaveFornecedorService";
import { SaveLoteService } from "./src/service/SaveLoteService";
import { SaveOngService } from "./src/service/SaveOngService";
import { UpdateColetaStatusService } from "./src/service/UpdateColetaStatusService";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(
    "/categorias",
    adaptRoute(
        new ListCategoriasController(
            new ListCategoriasService(new CategoriasRepository())
        )
    )
);

app.get(
    "/cidades",
    adaptRoute(
        new ListCidadesController(
            new ListCidadesService(new CidadesRepository())
        )
    )
);

app.get(
    "/produtos",
    adaptRoute(
        new ListProdutosController(
            new ListProdutosService(new ProdutosRepository())
        )
    )
);

app.get(
    "/coletas/fornecedor/:idFornecedor",
    adaptRoute(
        new ListColetasFornecedorController(
            new ListColetasFornecedorService(new ColetasRepository())
        )
    )
);

app.get(
    "/coletas/ong/:idOng",
    adaptRoute(
        new ListColetasOngController(
            new ListColetasOngService(new ColetasRepository())
        )
    )
);

app.post(
    "/ong",
    adaptRoute(new SaveOngController(new SaveOngService(new OngRepository())))
);

app.post(
    "/fornecedor",
    adaptRoute(
        new SaveFornecedorController(
            new SaveFornecedorService(new FornecedorRepository())
        )
    )
);

app.post(
    "/coletas/ong/:idOng/lote/:idLote",
    adaptRoute(
        new SaveColetaController(new SaveColetaService(new ColetasRepository()))
    )
);

app.get(
    "/coletas/fornecedor/:idFornecedor",
    adaptRoute(
        new ListColetasFornecedorController(
            new ListColetasFornecedorService(new ColetasRepository())
        )
    )
);

app.get(
    "/lotes/fornecedor/:idFornecedor",
    adaptRoute(
        new ListLotesFornecedorController(
            new ListLotesFornecedoresService(new LotesRepository())
        )
    )
);

app.post(
    "/lotes/fornecedor/:idFornecedor/produto/:idProduto",
    adaptRoute(
        new SaveLoteController(new SaveLoteService(new LotesRepository()))
    )
);

app.put(
    "/coletas/:coletaId/status",
    adaptRoute(
        new UpdateColetaStatusController(
            new UpdateColetaStatusService(new ColetasRepository())
        )
    )
);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
