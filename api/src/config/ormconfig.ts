import { DataSource } from "typeorm";
import {User} from "../entity/user.entity";

const appDataSource = new DataSource({
    type: "postgres",
    host: "db",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "my_tv_list",
    entities: [User],
    synchronize: true,
});

appDataSource.initialize();

export default appDataSource;
