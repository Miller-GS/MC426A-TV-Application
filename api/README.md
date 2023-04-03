# Projeto de MC536

## Tema

O problema a ser resolvido é o desperdício de alimentos pelos mercados/restaurantes/estabelecimentos alimentícios no geral. Hoje, muitos dos alimentos produzidos/comprados vencem sem serem utilizados e geram lixo desnecessário, quando poderiam ser direcionados a pessoas de baixa renda que passam fome. Além disso, entra a questão de vegetais que quando são menos agradáveis em questão de aparência, mesmo aptos para consumo, acabam desperdiçados.
Por conta da questão contextualizada anteriormente, o sistema pensado visa armazenar o estoque de produtos desses estabelecimentos alimentícios quando estes estiverem perto do vencimento. Assim, tais locais poderiam escolher disponibilizar produtos para coleta de ONGs de localidade próxima, que cuidariam da separação e distribuição dos alimentos para entidades que fornecem comida para os necessitados.


## Configurações

Para rodar o projeto, é preciso ter instalado no computador as seguintes dependências:

1. yarn
2. node
3. docker-compose

## Setup

Para subir a instância do MariaDB, use o comando:
```bash 
docker-compose up -d
````

Na primeira execução:
- Acesse a url `localhost:8080`
- Faça o login com usuário `user` e senha `password`
- Entre no database `projeto`
- Importe os arquivos de criação e inserção contidos na pasta `init_db`

Para rodar localmente:
```bash 
yarn install # instalar as dependências
yarn build # compilar o projeto typescript em javascript
yarn start # subir a instância do aplicação
````

Os endpoints estarão disponíveis na url `localhost:3000`
