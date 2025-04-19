
import { Prisma, UserSex } from "../../generated/prisma/client";
import prisma from "../lib/prisma";
import { parseEnumValue } from "../utils/ParseEnumValues";


export class TeachersService {

    async getAllTeachers(
        page: number,
        limit: number,
        classId?: number,
        search?: string,
        gender?: string
    ) {
        try {
            const skip = (page - 1) * limit;

            const whereClause: Prisma.TeacherWhereInput = {};

            if (classId) {
                whereClause.lessons = {
                    some: {
                        classId,
                    },
                };
            }

            const genderEnum = parseEnumValue(UserSex, gender);
            if (genderEnum) {
                whereClause.sex = genderEnum;
            }
            if (search) {
                whereClause.OR = [
                    { id: { contains: search, mode: "insensitive" } },
                    { username: { contains: search, mode: "insensitive" } },
                    { surname: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                ];
            }

            const [teachers, total] = await Promise.all([
                prisma.teacher.findMany({
                    where: whereClause,
                    include: {
                        subjects: true,
                        classes: true,
                    },
                    take: limit,
                    skip,
                }),
                prisma.teacher.count({ where: whereClause }),
            ]);

            return {
                data: teachers,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };
        } catch (error) {
            console.error("❌ Error retrieving teachers:", error);
            throw new Error("❌ Failed to fetch teachers");
        }
    }


    async getTeacherById(id: string, page: number, limit: number) {
        try {
            const whereClause: Prisma.TeacherWhereUniqueInput = { id };
            const teacher = await prisma.teacher.findUnique({
                where: whereClause,
                include: {
                    subjects: true,
                    classes: true,
                },
            });

            const total = teacher ? 1 : 0;

            return {
                data: teacher,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };
        } catch (error: unknown) {
            console.error("❌ Error retrieving teacher:", error);
            throw new Error("❌ Failed to fetch teacher");
        }
    }
    
}