import * as express from "express";
import controller from "../controller";
const userController = controller.userController;
const router = express.Router({ strict: true });

router.get("/info", userController.info);

export default router;
