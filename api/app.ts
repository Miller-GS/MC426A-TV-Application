import express from "express";
import "reflect-metadata";
import { userRouter } from "./src/routes/user";
import mediaRouter from "./src/routes/media";
import commentRouter from "./src/routes/comment";
import cookieParser from "cookie-parser";
import { notificationRouter } from "./src/routes/notification";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/media", mediaRouter);
app.use("/notification", notificationRouter);
app.use("/comment", commentRouter);

export default app;
