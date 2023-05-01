import { UUID } from "crypto";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    Email: string;

    @Column()
    Password: string;

    @Column()
    SessionToken: string;

    @Column()
    IsSessionTokenValid: boolean;

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
}
