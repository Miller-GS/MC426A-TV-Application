import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
} from "typeorm";

import { WatchListEntity } from "./watchList.entity";
import { MediaEntity } from "./media.entity";

@Entity("watch_list_item")
export class WatchListItemEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @ManyToOne(
        () => WatchListEntity,
        (watchList: WatchListEntity) => watchList.WatchListItems
    )
    WatchList: WatchListEntity;

    @ManyToOne(
        () => MediaEntity,
        (media: MediaEntity) => media.WatchListItems,
        { onDelete: "CASCADE" }
    )
    Media: MediaEntity;

    @CreateDateColumn()
    CreatedAt: Date;

    @UpdateDateColumn()
    UpdatedAt: Date;
}
