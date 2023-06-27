import express from "express";
import "reflect-metadata";
import { userRouter } from "./src/routes/user";
import mediaRouter from "./src/routes/media";
import commentRouter from "./src/routes/comment";
import { notificationRouter } from "./src/routes/notification";
import friendshipRouter from "./src/routes/friendship";
import { watchListRouter } from "./src/routes/watchList";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/media", mediaRouter);
app.use("/notification", notificationRouter);
app.use("/comment", commentRouter);
app.use("/friendship", friendshipRouter);
app.use("/watchlist", watchListRouter);

export default app;
