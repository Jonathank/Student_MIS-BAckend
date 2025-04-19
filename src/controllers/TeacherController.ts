import { Request, Response } from "express";
import { TeachersService } from "../services/TeacherServices";
import { HttpResponse } from "../domain/Response";
import { Code } from "../enum/Code.enum";
import { Status } from "../enum/Status.enum";

export class TeachersController {

    private teachersService: TeachersService;

    constructor() {
        this.teachersService = new TeachersService();
    }

    public getAllTeachers = async (req: Request, res: Response): Promise<any> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const classId = req.query.classId ? parseInt(req.query.classId as string) : undefined;
            const gender = req.query.gender as string | undefined;
            const search = req.query.search as string | undefined;

            const teachers = await this.teachersService.getAllTeachers(page, limit, classId, search, gender);

            return res.status(Code.OK).json(
                new HttpResponse(Code.OK, Status.OK, "Teachers retrieved", teachers)
            );
        } catch (error: unknown) {
            console.error("❌ Error retrieving teachers:", error);
            return res.status(Code.INTERNAL_SERVER_ERROR).json(
                new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, "❌ An error occurred")
            );
        }
    };

    
    public getTeacherById = async (req: Request, res: Response): Promise<any> => {
        try {
            const id = req.params.id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const teacher = await this.teachersService.getTeacherById(id, page, limit);

            return res.status(Code.OK).json(
                new HttpResponse(Code.OK, Status.OK, "Teacher retrieved", teacher)
            );
        } catch (error: unknown) {
            console.error("❌ Error retrieving teacher:", error);
            return res.status(Code.INTERNAL_SERVER_ERROR).json(
                new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, "❌ An error occurred")
            );
        }
    };
}