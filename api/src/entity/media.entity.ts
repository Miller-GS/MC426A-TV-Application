import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from "typeorm";

@Entity("media")
export class MediaEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    ExternalId: number;

    @Column()
    Type: string;

    @CreateDateColumn()
    CreatedAt: Date;
}
