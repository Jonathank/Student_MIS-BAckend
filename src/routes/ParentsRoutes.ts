
import { Router } from "express";
import { ParentsController } from "../controllers/ParentsController";

const ParentsRoutes = Router();

const parentsController = new ParentsController();

ParentsRoutes.get("/lists/parents", (req, res) => parentsController.getAllParents(req, res));
ParentsRoutes.get("/lists/parents/:id", (req, res) => parentsController.getParentById(req, res));

export default ParentsRoutes; 