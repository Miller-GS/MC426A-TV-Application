import express from "express";
import "reflect-metadata";
import { usersRouter } from "./src/routes/users";
import tvRouter from "./src/routes/tv";
import commentRouter from "./src/routes/comment";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/users", usersRouter);
app.use("/tv", tvRouter);
app.use("/comment", commentRouter);

export default app;
