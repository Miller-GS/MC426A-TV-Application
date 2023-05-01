import express, { Router } from "express";
import { usersRouter,  controller} from "./src/routes/users";
import "reflect-metadata";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", usersRouter);


export default app;

setInterval(controller.updateTokenValidity, 15000);
