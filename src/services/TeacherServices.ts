
import { Prisma, Teacher, UserSex } from "../../generated/prisma/client";
import prisma from "../lib/prisma";
import { getCache, setCache } from "../lib/redisClient";
import { parseEnumValue } from "../utils/ParseEnumValues";


export class TeachersService {

    async getAllTeachers(
        page: number,
        limit: number,
        classId?: number,
        search?: string,
        gender?: string
    ) {
        const cacheKey = `teacher:page=${page}&limit=${limit}&classId=${classId ?? ''}&search=${search ?? ''}&gender=${gender ?? ''}`;

        try {
            const cached = await getCache<{
                data: Teacher[];
                total: number;
                page: number;
                limit: number;
                totalPages: number;
            }>(cacheKey);

            if (cached) return cached;

            const skip = (page - 1) * limit;

            const whereConditions: Prisma.TeacherWhereInput[] = [];


            if (classId) {
                whereConditions.push({
                    lessons: {
                        some: {
                            classId,
                        },
                    },
                });
            }

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

            const where: Prisma.TeacherWhereInput = whereConditions.length
                ? { AND: whereConditions }
                : {};

            const [teachers, total] = await Promise.all([
                prisma.teacher.findMany({
                    where,
                    include: {
                        subjects: true,
                        classes: true,
                    },
                    take: limit,
                    skip,
                }),
                prisma.teacher.count({ where }),
            ]);

            const result = {
                data: teachers,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };

            if (teachers.length > 0) {
                await setCache(cacheKey, result);
            }

            return result;
        } catch (error) {
            console.error("❌ Error retrieving teachers:", error);
            throw new Error("❌ Failed to fetch teachers");
        }
    }

    async getTeacherById(id: string, page: number, limit: number) {
        const cacheKey = `teacher:${id}:page=${page}&limit=${limit}`;

        try {
            // 1. Check cache
            const cached = await getCache<{
                data: Teacher[];
                total: number;
                page: number;
                limit: number;
                totalPages: number;
            }>(cacheKey);
            if (cached) {
                return cached;
            }
            // 2. Build where clause and pagination
            const whereClause: Prisma.TeacherWhereUniqueInput = { id };

            const [teacher, total] = await Promise.all([
                prisma.teacher.findUnique({
                    where: whereClause,
                    include: {
                        subjects: true,
                        classes: true,
                    },
                }),
                prisma.teacher.count({ where: { id } })
            ]);

           const result = {
                data: teacher,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };
            await setCache(cacheKey, result);
            return result;
            
        } catch (error: unknown) {
            console.error("❌ Error retrieving teacher:", error);
            throw new Error("❌ Failed to fetch teacher");
        }
    }

}