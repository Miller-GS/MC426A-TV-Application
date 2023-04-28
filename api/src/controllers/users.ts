import {createConnection} from "typeorm";
import {User} from "../entity/user"; //import User entity
import appDataSource from '../config/ormconfig';

export default class UsersController {
    private repository;

    public constructor() {
        this.repository = appDataSource.getRepository(User);
    }

    public login(req, res) {
        createConnection().then(async connection => { 

            console.log("Inserting a new record into the student database..."); 
            
            //create student object 
            const user = new User(); 
            
            //Assign student name and age here 
            user.Name = "student1"; 
            user.Email = "student1@asdas.com";
            user.Password = "123456";
            
             //save student object in connection 
             await connection.manager.save(user);
             console.log("Saved a new user with id: " + user.id);
             
             console.log("Loading users from the database...");
         
             //Display student saved records
             const users = await connection.manager.find(User);
             console.log("Loaded users: ", users);
         
             console.log("Here you can setup and run express/koa/any other framework.");

             res.send(users);
         }).catch(error => console.log(error));
    }
}
