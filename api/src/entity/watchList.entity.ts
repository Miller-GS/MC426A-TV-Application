import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
} from "typeorm";
import { WatchListItemEntity } from "./watchListItem.entity";

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
