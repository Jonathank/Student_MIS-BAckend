import { Request, Response } from "express";
import { HttpResponse } from "../domain/Response";
import { Code } from "../enum/Code.enum";
import { Status } from "../enum/Status.enum";
import { StudentsService } from "../services/StudentsServices";

export class StudentsController {

    private StudentsService: StudentsService;

    constructor() {
        this.StudentsService = new StudentsService();
    }

    public getAllStudents = async (req: Request, res: Response): Promise<any> => {
        console.info(`[${new Date().toLocaleString()}] Incoming ${req.method} ${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);

        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            // Extract optional filters
            const classId = req.query.classId ? parseInt(req.query.classId as string) : undefined;
            const search = req.query.search as string | undefined;
            const gender = req.query.gender as string | undefined;
            const teacherId = req.query.teacherId as string | undefined;

            const students = await this.StudentsService.getAllStudents(
                page,
                limit,
                classId,
                search,
                gender,
                teacherId
            );

            return res.status(Code.OK)
                .json(new HttpResponse(Code.OK, Status.OK, 'Students retrieved', students));
        } catch (error: unknown) {
            console.error('❌ Error retrieving students:', error);

            return res.status(Code.INTERNAL_SERVER_ERROR)
                .json(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, '❌ An error occurred'));
        }
    }

    public getStudentById = async (req: Request, res: Response): Promise<any> => {
        console.info(`[${new Date().toLocaleString()}] Incoming ${req.method} ${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);
        try {
            const id = req.params.id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const student = await this.StudentsService.getStudentById(id, page, limit);

            return res.status(Code.OK)
                .json(new HttpResponse(Code.OK, Status.OK, 'Student retrieved', student));
        } catch (error: unknown) {
            console.error('❌ Error retrieving student:', error);

            return res.status(Code.INTERNAL_SERVER_ERROR)
                .json(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, '❌ An error occurred'));
        }
    }  
    
}