import express, { Router } from "express";
import { usersRouter,  controller} from "./src/routes/users";
import "reflect-metadata";
import tvRouter from "./src/routes/tv";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", usersRouter);
app.use("/tv", tvRouter);

export default app;
