"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const controller_1 = require("../controller");
const adminController = controller_1.default.adminController;
const router = express.Router({ strict: true });
router.get("/info", adminController.info);
exports.default = router;
