import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from "typeorm";

@Entity("rating")
export class RatingEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    UserId: number;

    @Column()
    MediaId: number;

    @Column()
    Rating: number;

    @Column({ type: "text", nullable: true, default: null })
    Review!: string;

    @CreateDateColumn()
    CreatedAt: Date;

    @UpdateDateColumn()
    UpdatedAt: Date;

    @DeleteDateColumn()
    DeletedAt: Date;
}
