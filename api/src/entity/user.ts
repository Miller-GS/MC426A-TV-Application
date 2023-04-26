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
   
    @Column() 
    Birthday: Date;

    @Column()
    CreatedAt: Date;

    @Column()
    UpdatedAt: Date;

    @Column()
    DeletedAt: Date;
}