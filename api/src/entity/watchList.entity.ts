import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
    ManyToOne,
} from "typeorm";
import { WatchListItemEntity } from "./watchListItem.entity";
import { UserEntity } from "./user.entity";

export enum WatchListPrivacyType {
    PUBLIC = "Public",
    PRIVATE = "Private",
    FRIENDS_ONLY = "FriendsOnly",
}

@Entity("watch_list")
export class WatchListEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    Title: string;

    @Column()
    Description: string;

    @Column({
        type: "enum",
        enum: WatchListPrivacyType,
        default: WatchListPrivacyType.PUBLIC,
    })
    PrivacyType: WatchListPrivacyType;

    @ManyToOne(
        () => UserEntity,
        (user: UserEntity) => user.WatchLists
    )
    Owner: UserEntity;

    @OneToMany(
        () => WatchListItemEntity,
        (watchListItem: WatchListItemEntity) => watchListItem.WatchList
    )
    WatchListItems: WatchListItemEntity[];

    @CreateDateColumn()
    CreatedAt: Date;

    @UpdateDateColumn()
    UpdatedAt: Date;

    @DeleteDateColumn()
    DeletedAt: Date;
}
