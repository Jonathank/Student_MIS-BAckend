import { Request, Response } from "express";
import { HttpResponse } from "../domain/Response";
import { Code } from "../enum/Code.enum";
import { Status } from "../enum/Status.enum";
import { ClassesService } from "../services/ClassesServices";

export class ClassesController {

    private classesService: ClassesService;

    constructor() {
        this.classesService = new ClassesService();
    }

    public getAllClasses = async (req: Request, res: Response): Promise<any> => {
        console.info(`[${new Date().toLocaleString()}] Incoming ${req.method} ${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);

        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string | undefined;
            const supervisorId = req.query.supervisorId as string | undefined;
            
            const Classes = await this.classesService.getAllClasses(
                page,
                limit,
                search,
                supervisorId,
            );

            return res.status(Code.OK)
                .json(new HttpResponse(Code.OK, Status.OK, 'Classes retrieved', Classes));
        } catch (error: unknown) {
            console.error('❌ Error retrieving Classes:', error);

            return res.status(Code.INTERNAL_SERVER_ERROR)
                .json(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, '❌ An error occurred'));
        }
    }





}