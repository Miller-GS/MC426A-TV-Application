import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from "typeorm";

@Entity("comment")
export class CommentEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ type: "integer", nullable: true, default: null })
    UserId: number | null;

    @Column({ nullable: true, default: null })
    ParentId: number;

    @Column()
    MediaId: number;

    @Column()
    Content: string;

    @Column({ default: false })
    Edited: boolean;

    @CreateDateColumn()
    CreatedAt: Date;

    @UpdateDateColumn()
    UpdatedAt: Date;

    @DeleteDateColumn()
    DeletedAt: Date;
}
