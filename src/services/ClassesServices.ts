import { Prisma, Class } from "../../generated/prisma/client";
import { fetchPaginatedWithCache } from "../utils/prismaFetchers";

export class ClassesService {


    async getAllClasses(
        page: number,
        limit: number,
        search?: string,
        supervisorId?:string,
    ) {
        const whereConditions: Prisma.ClassWhereInput[] = [];

        if (supervisorId) {
            whereConditions.push({
             supervisorId
            })
        }
        if (search) {
            whereConditions.push({
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                ],
            });
        }

        const where: Prisma.ClassWhereInput = whereConditions.length ? { AND: whereConditions } : {};

        return await fetchPaginatedWithCache<Class>({
            model: 'class',
            cachePrefix: 'classes',
            page,
            limit,
            where,
            include: {
             supervisor: {select:{surname:true, username:true}}
            },
        });
    }
}