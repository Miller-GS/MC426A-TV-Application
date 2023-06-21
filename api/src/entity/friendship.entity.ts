import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryColumn,
} from 'typeorm';

export enum FriendshipStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    DECLINED = 'declined',
    BLOCKED = 'blocked'
}

@Entity("friendship")
export class FriendshipEntity {

    @PrimaryColumn()
    UserId1: number;

    @PrimaryColumn()
    UserId2: number;

    @Column({
        type: "enum",
        enum: FriendshipStatus,
        default: FriendshipStatus.PENDING
    })
    Status: FriendshipStatus;

    @Column()
    ActionUserId: number;

    @CreateDateColumn()
    CreatedAt: Date;

    @UpdateDateColumn()
    UpdatedAt: Date;
}
