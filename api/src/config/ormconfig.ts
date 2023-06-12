import { DataSource } from "typeorm";
import { User } from "../entity/user.entity";
import env from "../../environment";
import { Notification } from "../entity/notification.entity";

const appDataSource = new DataSource({
    type: "postgres",
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    entities: [User, Notification],
    synchronize: true,
});

appDataSource.initialize();

export default appDataSource;
