import { UUID } from "crypto";
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum FriendshipStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    DECLINED = 'declined',
    BLOCKED = 'blocked'
}

@Entity()
export class Friendship {
    @PrimaryColumn()
    user_id1: number;

    @PrimaryColumn()
    user_id2: number;

    @Column({
        type: "enum",
        enum: FriendshipStatus,
        default: FriendshipStatus.PENDING
    })
    status: FriendshipStatus;

    @Column()
    action_user_id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
