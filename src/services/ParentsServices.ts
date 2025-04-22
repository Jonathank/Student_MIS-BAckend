import { Parent, Prisma, UserSex } from "../../generated/prisma/client";
import prisma from "../lib/prisma";
import { getCache, setCache } from "../lib/redisClient";
import { parseEnumValue } from "../utils/ParseEnumValues";


export class ParentsService {

    async getParentById(id: string, page: number, limit: number) {
        const cacheKey = `parent:${id}:page=${page}&limit=${limit}`;

        try {
            // 1. Check cache
            const cached = await getCache<{
                data: Parent[];
                total: number;
                page: number;
                limit: number;
                totalPages: number;
            }>(cacheKey);
            if (cached) {
                return cached;
            }
            // 2. Build where clause and pagination
            const whereClause: Prisma.ParentWhereUniqueInput = { id };

            // 3. Fetch from DB
            const [parent, total] = await Promise.all([
                prisma.parent.findUnique({
                    where: whereClause,
                    include: {
                        students: true,
                    }
                }),
                prisma.parent.count({ where: { id } }), // count will be 1 or 0
            ]);

            const result = {
                data: parent,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };

            // 4. Cache and return
            await setCache(cacheKey, result);
            return result;
        } catch (error: unknown) {
            console.error("❌Error retrieving parent:", error);
            throw new Error("❌ Failed to fetch parent");
        }
    }


    async getAllParents(
        page: number,
        limit: number,
        search?: string,
        gender?: string
    ) {
        const cacheKey = `parents:page=${page}&limit=${limit}&search=${search ?? ''}&gender=${gender ?? ''}`;

        try {
            const cached = await getCache<{
                data: Parent[];
                total: number;
                page: number;
                limit: number;
                totalPages: number;
            }>(cacheKey);

            if (cached) return cached;

            const skip = (page - 1) * limit;

            const whereConditions: Prisma.ParentWhereInput[] = [];

            const genderEnum = parseEnumValue(UserSex, gender);
            if (genderEnum) {
                whereConditions.push({ sex: genderEnum });
            }

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

        
            const where: Prisma.ParentWhereInput = whereConditions.length
                ? { AND: whereConditions }
                : {};

            const [parents, total] = await Promise.all([
                prisma.parent.findMany({
                    where,
                    include: {
                       students : true,
                    },
                    skip,
                    take: limit,
                }),
                prisma.parent.count({ where }),
            ]);

            const result = {
                data: parents,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };

            if (parents.length > 0) {
                await setCache(cacheKey, result);
            }

            return result;
        } catch (error: unknown) {
            console.error("❌ Error retrieving Parents:", error);
            throw new Error("❌ Failed to fetch Parents");
        }
    }

}