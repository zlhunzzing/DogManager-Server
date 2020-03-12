"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const controller_1 = require("../controller");
const userController = controller_1.default.userController;
const router = express.Router({ strict: true });
router.get("/info", userController.info);
exports.default = router;
