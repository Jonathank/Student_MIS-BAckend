"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../../generated/prisma/client");
const globalForPrisma = global;
let prisma;
try {
    prisma = globalForPrisma.prisma || new client_1.PrismaClient();
    if (process.env.NODE_ENV !== "production") {
        globalForPrisma.prisma = prisma;
    }
}
catch (error) {
    console.error("Failed to initialize Prisma Client:", error);
    throw error;
}
exports.default = prisma;
//# sourceMappingURL=prisma.js.map