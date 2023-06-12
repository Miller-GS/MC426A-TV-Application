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

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    Id: number;

    @ManyToOne(() => User, (user: User) => user.Notifications)
    User: User;

    @Column()
    Text: string;

    @CreateDateColumn()
    CreatedAt: Date;

    @UpdateDateColumn()
    UpdatedAt: Date;

    @DeleteDateColumn()
    ReadAt: Date;
}
