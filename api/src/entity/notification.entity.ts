import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
} from "typeorm";
import { User } from "./user.entity";

export enum NotificationType {
}

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    Id: number;

    @ManyToOne(() => User, (user: User) => user.Notifications)
    User: User;

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
