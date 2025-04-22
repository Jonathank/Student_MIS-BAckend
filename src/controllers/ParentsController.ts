import { Request, Response } from "express";
import { HttpResponse } from "../domain/Response";
import { Code } from "../enum/Code.enum";
import { Status } from "../enum/Status.enum";
import { ParentsService } from "../services/ParentsServices";

export class ParentsController {

    private ParentsService: ParentsService;

    constructor() {
        this.ParentsService = new ParentsService();
    }

    public getAllParents = async (req: Request, res: Response): Promise<any> => {
        console.info(`[${new Date().toLocaleString()}] Incoming ${req.method} ${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);

        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            // Extract optional filters
            const search = req.query.search as string | undefined;
            const gender = req.query.gender as string | undefined;
            
            const parents = await this.ParentsService.getAllParents(
                page,
                limit,
                search,
                gender,
            );

            return res.status(Code.OK)
                .json(new HttpResponse(Code.OK, Status.OK, 'Parents retrieved', parents));
        } catch (error: unknown) {
            console.error('❌ Error retrieving Parents:', error);

            return res.status(Code.INTERNAL_SERVER_ERROR)
                .json(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, '❌ An error occurred'));
        }
    }

    public getParentById = async (req: Request, res: Response): Promise<any> => {
        console.info(`[${new Date().toLocaleString()}] Incoming ${req.method} ${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);
        try {
            const id = req.params.id;
            
            const parent = await this.ParentsService.getParentById(id);

            return res.status(Code.OK)
                .json(new HttpResponse(Code.OK, Status.OK, 'Parent retrieved', parent));
        } catch (error: unknown) {
            console.error('❌ Error retrieving Parent:', error);

            return res.status(Code.INTERNAL_SERVER_ERROR)
                .json(new HttpResponse(Code.INTERNAL_SERVER_ERROR, Status.INTERNAL_SERVER_ERROR, '❌ An error occurred'));
        }
    }

    

}