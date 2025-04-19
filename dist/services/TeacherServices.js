"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeachersService = void 0;
const client_1 = require("../../generated/prisma/client");
const prisma_1 = __importDefault(require("../lib/prisma"));
const ParseEnumValues_1 = require("../utils/ParseEnumValues");
class TeachersService {
    async getAllTeachers(page, limit, classId, search, gender) {
        try {
            const skip = (page - 1) * limit;
            const whereClause = {};
            if (classId) {
                whereClause.lessons = {
                    some: {
                        classId,
                    },
                };
            }
            const genderEnum = (0, ParseEnumValues_1.parseEnumValue)(client_1.UserSex, gender);
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
                prisma_1.default.teacher.findMany({
                    where: whereClause,
                    include: {
                        subjects: true,
                        classes: true,
                    },
                    take: limit,
                    skip,
                }),
                prisma_1.default.teacher.count({ where: whereClause }),
            ]);
            return {
                data: teachers,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };
        }
        catch (error) {
            console.error("Error retrieving teachers:", error);
            throw new Error("Failed to fetch teachers");
        }
    }
    async getTeacherById(id, page, limit) {
        try {
            const skip = (page - 1) * limit;
            const whereClause = { id };
            const teacher = await prisma_1.default.teacher.findUnique({
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
        }
        catch (error) {
            console.error("Error retrieving teacher:", error);
            throw new Error("Failed to fetch teacher");
        }
    }
}
exports.TeachersService = TeachersService;
//# sourceMappingURL=TeacherServices.js.map