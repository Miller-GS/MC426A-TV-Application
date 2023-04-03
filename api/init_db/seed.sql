INSERT INTO
  Categoria (rotulo, perecivel)
VALUES
  ("laticínios", 1),
  ("grãos", 1),
  ("verduras", 1),
  ("frutas", 1),
  ("enlatados", 1),
  ("limpeza", 0),
  ("higiene", 0),
  ("bebidas", 1),
  ("temperos", 1),
  ("carnes", 1),
  ("padaria", 1),
  ("industrializados", 1);
 
INSERT INTO
  Produto (nome, vida_util, id_categoria)
VALUES
  ("leite", 10, 1),
  ("iogurte de morango", 10, 1),
  ("manteiga", 10, 1),
  ("requeijão", 10, 1),
  ("feijão", 30, 2),
  ("arroz", 30, 2),
  ("grão de bico", 30, 2),
  ("cenoura", 14, 3),
  ("chuchu", 14, 3),
  ("abobrinha", 14, 3),
  ("abóbora", 14, 3),
  ("laranja", 14, 4),
  ("melancia", 14, 4),
  ("melão", 14, 4),
  ("milho cozido", 60, 5),
  ("feijão enlatado", 60, 5),
  ("sabão em pó", NULL, 7),
  ("sabonete de banho", NULL, 7),
  ("suco em pó", NULL, 12),
  ("suco de caixinha", 60, 8),
  ("refrigerante", 120, 8),
  ("frango", 15, 10),
  ("acém", 15, 10),
  ("pão de forma", 15, 11),
  ("pão francês", 15, 11),
  ("bolacha maisena", 60, 12),
  ("bolacha recheada", 60, 12),
  ("salgadinho", 60, 12);
 
INSERT INTO
  Cidade (nome, estado)
VALUES
  ("Campinas", "SP"),
  ("Itu", "SP"),
  ("São Paulo", "SP"),
  ("Curitiba", "PR"),
  ("Florianópolis", "SC"),
  ("Vitória", "ES"),
  ("Salvador", "BA"),
  ("Belo Horizonte", "MG"),
  ("Campo Grande", "MS"),
  ("Brasília", "GO"),
  ("Goiânia", "GO"),
  ("Americana", "SP"),
  ("Paulínia", "SP"),
  ("Cosmópolis", "SP"),
  ("Rio Claro", "SP"),
  ("Indaiatuba", "SP"),
  ("Vinhedo", "SP"),
  ("Recife", "PE"),
  ("Fortaleza", "CE"),
  ("São Carlos", "SP");
 
INSERT INTO
  ONG (nome, endereco, telefone, email)
VALUES
  (
     "Intituto Sophia",
     "Rua Amarela, 655 - Lageadinho",
     "(11)999979997",
     "intitutosophia@gmail.com"
  ),
  (
     "Intituto Reparando Vidas",
     "Rua 14 de Janeiro, 1021 - Igrejinha",
     "(14)848484884",
     "reparando.vidas@hotmail.com"
  ),
  (
     "Teto América",
     "Avenida Brasil, 8900 - Guriri Norte",
     "(19)777666777",
     "teto_am@gmail.com"
  ),
  (
     "CAPESR",
     "Rua Porteira Santa, 10 - Vila Joana",
     "(31)666426660",
     "contato@capesd.com.br"
  ),
  (
     "SOS Brasil",
     "Avenida Oswaldo Romeu, 752 - Guará",
     "(22)954321432",
     "sos.br@outlook.com"
  ),
  (
     "Viva o Amanhã",
     "Rua Cecília Abreu, 800 - Bom Retiro",
     "(85)909125478",
     "contato.viva_o_amanha@gmail.com"
  ),
  (
     "Fundação Amiga",
     "Alameda Barão Geraldo, 90 - Cidade Nova",
     "(66)533343334",
     "fundacao.amiga.ajuda@yahoo.com"
  ),
  (
     "Casa de Acolhimento Santos",
     "Rua Frederico Moura, 881 - Vila Jardim Rio Claro",
     "(21)23276671",
     "acolhimento.santos@outlook.com"
  ),
  (
     "Fraternidade e União",
     "Avenida Desembargador Moreira, 372 - Monte Castelo",
     "(68)39377646",
     "apoio_contato@fraternidadeuniao.com.br"
  ),
  (
     "Criando um Brasil Melhor",
     "Avenida Governador José Malcher, 1015 - Nazaré",
     "(91)22412726",
     "criandoumbrmelhor.contato@gmail.com"
  );
 
INSERT INTO
  Fornecedor (nome, endereco, telefone, email)
VALUES
  (
     "Supermercado Noite",
     "Avenida Paula Santos, 570 - Cidade Nova",
     "(11)22386691",
     "ajuda@supernoite.com.br"
  ),
  (
     "Grupo Pão de Sal",
     "Avenida Cecília Pablo, 10883 - Parque Imperial",
     "(19)929467732",
     "suporte.cliente@gppaodesal.com"
  ),
  (
     "Carrefive",
     "Rodovia Meire Elísio, 70 - Vila da Saúde",
     "(19)936363915",
     "atendimento.ongs@carrefive.com"
  ),
  (
     "Hortigrill",
     "Rua Casa Branca, 3766 - Aldeota",
     "(19)923681263",
     "hortigrill_suporte@hotmail.com"
  ),
  (
     "Gatemart",
     "Rua Tenente-Coronel Cardoso, 505 - Centro",
     "(19)34523066",
     "gatemart_e_vc@hotmail.com"
  ),
  (
     "Coopi Atacados",
     "Rua Serra de Bragança, 112 - Vila Gomes Cardim",
     "(11)444444444",
     "contatosatisfacao@coopi.com.br"
  ),
  (
     "Especial Distribuidora",
     "Rua Cristiano Olsen, 90 - Jardim Sumaré",
     "(19)935014330",
     "apoio_espdist@gmail.com"
  );
 
INSERT INTO
  Atende (id_ong, id_cidade)
VALUES
  (1, 1),
  (1, 2),
  (1, 3),
  (2, 1),
  (3, 1),
  (3, 4),
  (4, 5),
  (4, 6),
  (4, 7),
  (5, 7),
  (6, 7),
  (7, 10),
  (7, 11),
  (7, 12),
  (8, 18),
  (9, 15),
  (9, 16),
  (9, 20),
  (10, 8);
 
INSERT INTO
  Fornece (id_fornecedor, id_cidade)
VALUES
  (1, 1),
  (1, 2),
  (1, 3),
  (2, 1),
  (3, 1),
  (3, 4),
  (4, 5),
  (4, 6),
  (4, 7),
  (5, 7),
  (6, 7),
  (7, 10),
  (7, 11),
  (7, 12);
 
INSERT INTO
  Lote (
     id_fornecedor,
     id_produto,
     quantidade,
     validade,
     disponivel
  )
VALUES
  (1, 1, 10, "2022-11-10", 1),
  (1, 2, 10, "2023-06-30", 0),
  (1, 19, 15, "2023-01-30", 1),
  (1, 27, 20, "2023-02-22", 1),
  (1, 7, 40, "2023-03-13", 1),
  (1, 18, 9, "2022-10-15", 0),
  (2, 10, 10, "2023-07-07", 1),
  (2, 28, 10, "2022-11-30", 1),
  (2, 20, 3, "2023-01-02", 1),
  (2, 5, 25, "2022-11-27", 1),
  (3, 11, 10, "2023-09-20", 1),
  (3, 22, 2, "2022-11-01", 1),
  (3, 13, 13, "2022-10-31", 1),
  (3, 17, 2, "2023-04-04", 1),
  (3, 24, 30, "2022-12-25", 1),
  (5, 3, 10, "2022-12-08", 1),
  (5, 14, 10, "2022-12-08", 1),
  (5, 19, 10, "2022-11-06", 1),
  (5, 7, 5, "2022-10-23", 1),
  (5, 18, 3, "2023-06-02", 1),
  (5, 10, 14, "2022-10-20", 1),
  (6, 9, 10, "2023-01-16", 1),
  (6, 28, 7, "2023-05-11", 1),
  (6, 11, 6, "2022-11-11", 1),
  (7, 15, 10, "2023-05-15", 1),
  (7, 12, 17, "2023-01-04", 1),
  (7, 22, 8, "2022-11-16", 1),
  (7, 23, 16, "2022-10-25", 1);
 
INSERT INTO
  Coleta (id_ong, id_lote, data_coleta, status_coleta)
VALUES
  (1, 1, "2022-12-10", "aguardando"),
  (1, 2, "2023-02-10", "concluida"),
  (1, 6, "2022-10-10", "concluida"),
  (2, 11, "2023-06-05", "confirmada"),
  (2, 15, "2022-11-01", "aguardando"),
  (3, 5, "2022-08-09", "cancelada"),
  (3, 8, "2022-11-20", "aguardando"),
  (4, 9, "2022-12-09", "aguardando"),
  (5, 3, "2023-01-01", "reagendar"),
  (5, 10, "2022-10-23", "aguardando"),
  (6, 7, "2023-05-07", "aguardando"),
  (6, 12, "2023-10-10", "cancelada"),
  (7, 1, "2022-07-10", "cancelada"),
  (7, 13, "2022-10-19", "aguardando");
 

