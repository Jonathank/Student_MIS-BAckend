"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TeacherController_1 = require("../controllers/TeacherController");
const TeacherRoutes = (0, express_1.Router)();
const teachersController = new TeacherController_1.TeachersController();
TeacherRoutes.get("/teachers", (req, res) => teachersController.getAllTeachers(req, res));
TeacherRoutes.get("/:id", (req, res) => teachersController.getTeacherById(req, res));
exports.default = TeacherRoutes;
//# sourceMappingURL=TeachersRoutes.js.map