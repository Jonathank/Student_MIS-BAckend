import { Prisma, Student, UserSex } from "../../generated/prisma/client";
import prisma from "../lib/prisma";
import { getCache, setCache } from "../lib/redisClient";
import { parseEnumValue } from "../utils/ParseEnumValues";


export class StudentsService {

    async getStudentById(id: string, page: number, limit: number) {
        const cacheKey = `student:${id}:page=${page}&limit=${limit}`;

        try {
            // 1. Check cache
            const cached = await getCache<{
                data: Student[];
                total: number;
                page: number;
                limit: number;
                totalPages: number;
            }>(cacheKey);
            if (cached) {
                return cached;
            }
            // 2. Build where clause and pagination
            const whereClause: Prisma.StudentWhereUniqueInput = { id };

            // 3. Fetch from DB
            const [student, total] = await Promise.all([
                prisma.student.findUnique({
                    where: whereClause,
                    include: {
                        grade: true,
                        class: true,
                    }
                }),
                prisma.student.count({ where: { id } }), // count will be 1 or 0
            ]);

            const result = {
                data: student,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };

            // 4. Cache and return
            await setCache(cacheKey, result);
            return result;
        } catch (error: unknown) {
            console.error("❌Error retrieving student:", error);
            throw new Error("❌ Failed to fetch student");
        }
    }


    async getAllStudents(
        page: number,
        limit: number,
        classId?: number,
        search?: string,
        gender?: string,
        teacherId?: string
    ) {
        const cacheKey = `students:page=${page}&limit=${limit}&classId=${classId ?? ''}&search=${search ?? ''}&gender=${gender ?? ''}&teacherId=${teacherId ?? ''}`;

        try {
            const cached = await getCache<{
                data: Student[];
                total: number;
                page: number;
                limit: number;
                totalPages: number;
            }>(cacheKey);

            if (cached) return cached;

            const skip = (page - 1) * limit;

            const whereConditions: Prisma.StudentWhereInput[] = [];

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

            if (classId) {
                whereConditions.push({ classId });
            }

            if (teacherId) {
                whereConditions.push({
                    class: {
                        lessons: {
                            some: { teacherId },
                        },
                    },
                });
            }

            const where: Prisma.StudentWhereInput = whereConditions.length
                ? { AND: whereConditions }
                : {};

            const [students, total] = await Promise.all([
                prisma.student.findMany({
                    where,
                    include: {
                        grade: true,
                        class: true,
                    },
                    skip,
                    take: limit,
                }),
                prisma.student.count({ where }),
            ]);

            const result = {
                data: students,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };

            if (students.length > 0) {
                await setCache(cacheKey, result);
            }

            return result;
        } catch (error: unknown) {
            console.error("❌ Error retrieving students:", error);
            throw new Error("❌ Failed to fetch students");
        }
    }

}