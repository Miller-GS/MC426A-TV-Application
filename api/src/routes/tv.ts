import express from "express";
import {TvController} from "../controllers/tv";
import TMDBService from "../services/tmdbService";
import { adaptRoute } from "./routerAdapter";

const tvRouter = express.Router();

const controller = new TvController(new TMDBService())

tvRouter.get("/list", adaptRoute((req, res) => controller.list_shows(req, res)));


export default tvRouter