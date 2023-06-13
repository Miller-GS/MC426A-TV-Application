import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
} from "typeorm";
import { UserEntity } from "./user.entity";

export enum NotificationType {
}

@Entity()
export class NotificationEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @ManyToOne(() => UserEntity, (user: UserEntity) => user.Notifications)
    User: UserEntity;

    @Column()
    Text: string;

    @Column({
        type: "enum",
        enum: NotificationType,
    })
    Type: NotificationType;

    @CreateDateColumn()
    CreatedAt: Date;

    @UpdateDateColumn()
    UpdatedAt: Date;

    @DeleteDateColumn()
    ReadAt: Date;
}
