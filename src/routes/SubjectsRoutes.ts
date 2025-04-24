
import { Router } from "express";
import { SubjectsController } from "../controllers/SubjectController";

const SubjectsRoutes = Router();

const subjectsController = new SubjectsController();

SubjectsRoutes.get("/lists/subjects", (req, res) => subjectsController.getAllSubjects(req, res));

export default SubjectsRoutes; 