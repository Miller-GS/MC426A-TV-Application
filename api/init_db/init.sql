CREATE TABLE IF NOT EXISTS ONG
(
id_ong INT PRIMARY KEY AUTO_INCREMENT, 
nome VARCHAR(60) NOT NULL, 
endereco VARCHAR(100) NOT NULL, 
telefone VARCHAR(14), 
email VARCHAR(100) 
);
 
CREATE TABLE IF NOT EXISTS Cidade
(
id_cidade INT PRIMARY KEY AUTO_INCREMENT, 
nome VARCHAR(60) NOT NULL, 
estado CHAR(2) NOT NULL
);
 
CREATE TABLE IF NOT EXISTS Fornecedor
(
id_fornecedor INT PRIMARY KEY AUTO_INCREMENT, 
nome VARCHAR(60) NOT NULL, 
telefone VARCHAR(14), 
endereco VARCHAR(100) NOT NULL, 
email VARCHAR(100)
);
 
CREATE TABLE IF NOT EXISTS Categoria
(
id_categoria INT PRIMARY KEY AUTO_INCREMENT, 
perecivel BIT NOT NULL,
rotulo VARCHAR(60) NOT NULL  
);
 
CREATE TABLE IF NOT EXISTS Produto
(
id_produto INT PRIMARY KEY AUTO_INCREMENT, 
nome VARCHAR(60) NOT NULL, 
vida_util INT, 
id_categoria INT REFERENCES Categoria(id_categoria)
);
 
CREATE TABLE IF NOT EXISTS Atende
(
id_ong INT NOT NULL REFERENCES ONG(id_ong), 
id_cidade INT NOT NULL REFERENCES Cidade(id_cidade),
 CONSTRAINT pk_atende PRIMARY KEY (id_ong, id_cidade)
);
 
CREATE TABLE IF NOT EXISTS Fornece
(
id_fornecedor INT NOT NULL REFERENCES Fornecedor(id_fornecedor), 
id_cidade INT NOT NULL REFERENCES Cidade(id_cidade),
 CONSTRAINT pk_fornece PRIMARY KEY (id_fornecedor, id_cidade)
);
 
CREATE TABLE IF NOT EXISTS Lote
(
id_lote INT PRIMARY KEY AUTO_INCREMENT, 
quantidade INT NOT NULL, 
validade DATE NOT NULL, 
disponivel BIT NOT NULL, 
id_fornecedor INT REFERENCES Fornecedor(id_fornecedor), 
id_produto INT REFERENCES Produto(id_produto) 
);
 
CREATE TABLE IF NOT EXISTS Coleta
(
id_coleta INT PRIMARY KEY AUTO_INCREMENT,
id_lote INT NOT NULL REFERENCES Lote(id_lote),
id_ong INT NOT NULL REFERENCES ONG(id_ong),
data_coleta DATE,  
status_coleta varchar(20) NOT NULL CHECK(status_coleta IN('aguardando', 'confirmada','reagendar','concluida','cancelada'))
);
 
 
CREATE UNIQUE INDEX rotulo_categoria ON Categoria(rotulo);
CREATE UNIQUE INDEX nome_produto ON Produto(nome);
 

