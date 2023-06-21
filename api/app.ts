import express from "express";
import "reflect-metadata";
import { usersRouter } from "./src/routes/users";
import tvRouter from "./src/routes/tv";
import commentRouter from "./src/routes/comment";
import cookieParser from "cookie-parser";
import { notificationRouter } from "./src/routes/notification";
import friendshipRouter from "./src/routes/friendship";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/users", usersRouter);
app.use("/tv", tvRouter);
app.use("/notification", notificationRouter);
app.use("/comment", commentRouter);
app.use("/friendship", friendshipRouter);

export default app;
