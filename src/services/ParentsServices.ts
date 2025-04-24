import { Parent, Prisma, UserSex } from "../../generated/prisma/client";
import { parseEnumValue } from "../utils/ParseEnumValues";
import { fetchByIdWithCache, fetchPaginatedWithCache } from "../utils/prismaFetchers";


export class ParentsService {

    async getParentById(id: string) {
        return await fetchByIdWithCache<Parent>({
            model: 'parent',
            id,
            cachePrefix: 'parent',
            include: {
                students: true
            }
        });
    }

    async getAllParents(
        page: number,
        limit: number,
        search?: string,
        gender?: string
    ) {
        const whereConditions: Prisma.ParentWhereInput[] = [];

        const genderEnum = parseEnumValue(UserSex, gender);
        if (genderEnum) whereConditions.push({ sex: genderEnum });

        if (search) {
            whereConditions.push({
                OR: [
                    { id: { contains: search, mode: "insensitive" } },
                    { username: { contains: search, mode: "insensitive" } },
                    { surname: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                ],
            });
        }

        // Build the Prisma `where` clause by combining all filtering conditions.
        // If there are any conditions, use AND to join them; otherwise, return an empty filter.
        const where: Prisma.ParentWhereInput = whereConditions.length ? { AND: whereConditions } : {};

        return await fetchPaginatedWithCache<Parent>({
            model: 'parent',
            cachePrefix: 'parents',
            page,
            limit,
            where,
            include: {
                students: true,
            },
        })
    }

}