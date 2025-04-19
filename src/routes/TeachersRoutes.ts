import { Router } from "express";
import { TeachersController } from "../controllers/TeacherController";

const TeacherRoutes = Router();

const teachersController = new TeachersController();

TeacherRoutes.get("/lists/teachers", (req, res) => teachersController.getAllTeachers(req, res));
TeacherRoutes.get("/lists/teachers/:id", (req, res) => teachersController.getTeacherById(req, res));

export default TeacherRoutes;