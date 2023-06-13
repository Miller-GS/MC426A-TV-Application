import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
} from "typeorm";
import { Notification } from "./notification.entity";

@Entity("user")
export class UserEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    Email: string;

    @Column()
    Password: string;

    @Column({ nullable: true, default: null })
    RefreshToken: string;

    @Column()
    Name: string;

    @Column({ nullable: true, default: null })
    Birthday: Date;

    @CreateDateColumn()
    CreatedAt: Date;

    @UpdateDateColumn()
    UpdatedAt: Date;

    @DeleteDateColumn()
    DeletedAt: Date;

    @OneToMany(() => Notification, (notification: Notification) => notification.User)
    Notifications: Notification[];
}
