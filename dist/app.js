"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const admin_1 = __importDefault(require("./routes/admin"));
const user_1 = __importDefault(require("./routes/user"));
const cors_1 = __importDefault(require("cors"));
const createTypeormConnection_1 = require("./utils/createTypeormConnection");
const morgan_1 = __importDefault(require("morgan"));
const app = express_1.default();
const PORT = 3002;
app.use(body_parser_1.default.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors_1.default({
    origin: [
        "http://dogandcodemate.s3-website.ap-northeast-2.amazonaws.com",
        "http://localhost:3000"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
// app.use(morgan("dev"));
if (process.env.NODE_ENV !== "test") {
    createTypeormConnection_1.createTypeormConnection();
    app.use(morgan_1.default("dev"));
}
app.use("/api/user", user_1.default);
app.use("/api/admin", admin_1.default);
// start express server
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`app is listening in port ${PORT}`);
}));
exports.default = app;
