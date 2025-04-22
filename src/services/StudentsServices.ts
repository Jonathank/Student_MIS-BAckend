import { Prisma, Student, UserSex } from "../../generated/prisma/client";

import { parseEnumValue } from "../utils/ParseEnumValues";
import { fetchByIdWithCache, fetchPaginatedWithCache } from "../utils/prismaFetchers";

export class StudentsService {

    async getStudentById(id: string) {
        return await fetchByIdWithCache<Student>({
            model: 'student',
            id,
            cachePrefix: 'student',
            include: {
                grade: true,
                class: true,
            },
        });
    }

    async getAllStudents(
        page: number,
        limit: number,
        classId?: number,
        search?: string,
        gender?: string,
        teacherId?: string
    ) {
        const whereConditions: Prisma.StudentWhereInput[] = [];

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

        if (classId) whereConditions.push({ classId });

        if (teacherId) {
            whereConditions.push({
                class: {
                    lessons: {
                        some: { teacherId },
                    },
                },
            });
        }

        const where: Prisma.StudentWhereInput = whereConditions.length ? { AND: whereConditions } : {};

        return await fetchPaginatedWithCache<Student>({
            model: 'student',
            cachePrefix: 'students',
            page,
            limit,
            where,
            include: {
                grade: true,
                class: true,
            },
        });
    }
}