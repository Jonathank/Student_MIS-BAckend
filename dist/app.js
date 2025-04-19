"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const ip_1 = __importDefault(require("ip"));
const cors_1 = __importDefault(require("cors"));
const TeachersRoutes_1 = __importDefault(require("./routes/TeachersRoutes"));
// import StudentsRoutes from "./routes/StudentsRoutes";
class App {
    constructor(port = process.env.SERVER_PORT || 5001) {
        this.port = port;
        this.APPLICATION_RUNNING = "Application is running on:";
        this.ROUTE_NOT_FOUND = "Route does not exist on the server";
        this.API_PREFIX_List = "/jk-Nana/schools/mis-app";
        this.app = (0, express_1.default)();
        this.middleware();
        this.routes();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`${this.APPLICATION_RUNNING} http://${ip_1.default.address()}:${this.port}`);
        });
    }
    middleware() {
        this.app.use((0, cors_1.default)({ origin: '*' }));
        this.app.use(express_1.default.json());
        this.app.use((req, res, next) => {
            console.log(`[${req.method}] ${req.originalUrl}`);
            next();
        });
    }
    routes() {
        this.app.use(`${this.API_PREFIX_List}/lists`, TeachersRoutes_1.default);
        // this.app.use(`${this.API_PREFIX_List}/lists/students`, StudentsRoutes);
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map