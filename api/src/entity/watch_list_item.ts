import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
} from "typeorm";

import { WatchListEntity } from "./watch_list.entity";
import { MediaEntity } from "./media.entity";

@Entity("watch_list_item")
export class WatchListItemEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @ManyToOne(() => WatchListEntity, (watchList: WatchListEntity) => watchList.WatchListItems)
    WatchList: WatchListEntity;

    @ManyToOne(() => MediaEntity, (media: MediaEntity) => media.WatchListItems)
    Media: MediaEntity;

    @Column({
        default: 0,
    })
    Order: number;

    @CreateDateColumn()
    CreatedAt: Date;

    @UpdateDateColumn()
    UpdatedAt: Date;

    @DeleteDateColumn()
    DeletedAt: Date;
}