import express, { Router } from "express";
import { usersRouter } from "./src/routes/users";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", usersRouter);

export default app;