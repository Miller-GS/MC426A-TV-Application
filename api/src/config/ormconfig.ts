import { DataSource } from "typeorm";

const appDataSource = new DataSource({
    type: "postgres",
    host: "127.0.0.1",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "my_tv_list",
});

appDataSource.initialize();

export default appDataSource;
