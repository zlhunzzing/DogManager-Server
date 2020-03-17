"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("./user"));
const admin_1 = __importDefault(require("./admin"));
exports.default = {
    userController: user_1.default,
    adminController: admin_1.default
};
