import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from "typeorm";

import { WatchListItemEntity } from "./watchListItem.entity";

@Entity("media")
export class MediaEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    ExternalId: number;

    @OneToMany(() => WatchListItemEntity, (watchListItem: WatchListItemEntity) => watchListItem.Media)
    WatchListItems: WatchListItemEntity[];

    @Column()
    Type: string;

    @CreateDateColumn()
    CreatedAt: Date;
}
