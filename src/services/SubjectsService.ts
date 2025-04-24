import { Prisma, Subject} from "../../generated/prisma/client";
import { fetchPaginatedWithCache } from "../utils/prismaFetchers";

export class SubjectsService {


    async getAllSubjects(
        page: number,
        limit: number,
        search?: string,
    ) {
        const whereConditions: Prisma.SubjectWhereInput[] = [];

        if (search) {
            whereConditions.push({
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                ],
            });
        }

        const where: Prisma.SubjectWhereInput = whereConditions.length ? { AND: whereConditions } : {};

        return await fetchPaginatedWithCache<Subject>({
            model: 'subject',
            cachePrefix: 'subjects',
            page,
            limit,
            where,
            include: {
                teachers: { select: { username:true, surname:true} }
            },
        });
    }
}