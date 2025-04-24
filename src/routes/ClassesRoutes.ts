
import { Router } from "express";
import { ClassesController } from "../controllers/ClassesController";

const ClassesRoutes = Router();

const classesController = new ClassesController();

ClassesRoutes.get("/lists/classes", (req, res) => classesController.getAllClasses(req, res));

export default ClassesRoutes; 