"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const controller_1 = __importDefault(require("../controller"));
const userController = controller_1.default.userController;
const router = express.Router({ strict: true });
router.get("/events/list", userController.getEventListController);
router.get("/events/entry/:url", userController.getEventEntryController);
exports.default = router;
