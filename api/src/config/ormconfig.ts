import { DataSource } from "typeorm";
import { UserEntity } from "../entity/user.entity";
import { MediaEntity } from "../entity/media.entity";
import { CommentEntity } from "../entity/comment.entity";
import { FriendshipEntity } from "../entity/friendship.entity";
import env from "../../environment";
import { NotificationEntity } from "../entity/notification.entity";

const appDataSource = new DataSource({
    type: "postgres",
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    entities: [
        UserEntity,
        MediaEntity,
        CommentEntity,
        NotificationEntity,
        FriendshipEntity,
    ],
    migrations: ["src/migration/**/*.ts"],
    synchronize: true,
});

appDataSource.initialize();

export default appDataSource;
