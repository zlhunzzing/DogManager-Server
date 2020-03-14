import * as express from "express";
import controller from "../controller";
const userController = controller.userController;
const router = express.Router({ strict: true });

router.get("/events/list", userController.getEventListController);

router.get("/events/entry/:id", userController.getEventEntryController);

export default router;
