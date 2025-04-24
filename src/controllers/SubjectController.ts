import { Request, Response } from "express";
import { HttpResponse } from "../domain/Response";
import { Code } from "../enum/Code.enum";
import { Status } from "../enum/Status.enum";
import { SubjectsService } from "../services/SubjectsService";

export class SubjectsController {

    private SubjectsService: SubjectsService;

    constructor() {
        this.SubjectsService = new SubjectsService();
    }

    public getAllSubjects = async (req: Request, res: Response): Promise<any> => {
        console.info(`[${new Date().toLocaleString()}] Incoming ${req.method} ${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);

        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string | undefined;
            
            const subjects = await this.SubjectsService.getAllSubjects(
                page,
                limit,
                search,
            );

            return res.status(Code.OK)
                .json(new HttpResponse(Code.OK, Status.OK, 'Subjects retrieved', subjects));
        } catch (error: unknown) {
            console.error('❌ Error retrieving Subjects:', error);

            return res.status(Code.INTERNAL_SERVER_ERROR)
                .json(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, '❌ An error occurred'));
        }
    }





}