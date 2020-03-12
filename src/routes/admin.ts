import * as express from "express";
import controller from "../controller";
const adminController = controller.adminController;
const router = express.Router({ strict: true });

router.get("/info", adminController.info);

export default router;
