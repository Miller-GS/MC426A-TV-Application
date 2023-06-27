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

    @Column({ type: "integer" })
    UserId: number;

    @Column()
    MediaId: number;

    @Column()
    Rating: number;

    @Column({ default: null })
    Review: string | null;

    @CreateDateColumn()
    CreatedAt: Date;

    @UpdateDateColumn()
    UpdatedAt: Date;

    @DeleteDateColumn()
    DeletedAt: Date;
}
