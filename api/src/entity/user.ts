import {Entity, PrimaryGeneratedColumn, Column} from "typeorm"; 

@Entity() 
export class User {   

    @PrimaryGeneratedColumn() 
    id: number; 
   
    @Column() 
    Email: string; 

    @Column()
    Password: string;

    @Column() 
    Name: string; 
   
    @Column({nullable: true, default: null}) 
    Birthday: Date;

    @Column({default: () => "CURRENT_TIMESTAMP"})
    CreatedAt: Date;

    @Column({default: () => "CURRENT_TIMESTAMP"})
    UpdatedAt: Date;    

    @Column({nullable: true, default: null})
    DeletedAt: Date;
}