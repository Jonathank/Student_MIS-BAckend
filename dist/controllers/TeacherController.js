"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeachersController = void 0;
const TeacherServices_1 = require("../services/TeacherServices");
const Response_1 = require("../domain/Response");
const Code_enum_1 = require("../enum/Code.enum");
const Status_enum_1 = require("../enum/Status.enum");
class TeachersController {
    constructor() {
        this.getAllTeachers = async (req, res) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const classId = req.query.classId ? parseInt(req.query.classId) : undefined;
                const gender = req.query.gender;
                const search = req.query.search;
                const teachers = await this.teachersService.getAllTeachers(page, limit, classId, search, gender);
                return res.status(Code_enum_1.Code.OK).json(new Response_1.HttpResponse(Code_enum_1.Code.OK, Status_enum_1.Status.OK, "Teachers retrieved", teachers));
            }
            catch (error) {
                console.error("Error retrieving teachers:", error);
                return res.status(Code_enum_1.Code.INTERNAL_SERVER_ERROR).json(new Response_1.HttpResponse(Code_enum_1.Code.INTERNAL_SERVER_ERROR, Status_enum_1.Status.INTERNAL_SERVER_ERROR, "An error occurred"));
            }
        };
        this.getTeacherById = async (req, res) => {
            try {
                const id = req.params.id;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const teacher = await this.teachersService.getTeacherById(id, page, limit);
                return res.status(Code_enum_1.Code.OK).json(new Response_1.HttpResponse(Code_enum_1.Code.OK, Status_enum_1.Status.OK, "Teacher retrieved", teacher));
            }
            catch (error) {
                console.error("Error retrieving teacher:", error);
                return res.status(Code_enum_1.Code.INTERNAL_SERVER_ERROR).json(new Response_1.HttpResponse(Code_enum_1.Code.INTERNAL_SERVER_ERROR, Status_enum_1.Status.INTERNAL_SERVER_ERROR, "An error occurred"));
            }
        };
        this.teachersService = new TeacherServices_1.TeachersService();
    }
}
exports.TeachersController = TeachersController;
//# sourceMappingURL=TeacherController.js.map