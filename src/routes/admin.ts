import * as express from "express";
import controller from "../controller";
const adminController = controller.adminController;
const router = express.Router({ strict: true });

router.post("/events/entry", adminController.addEventController);

router.get("/events/list", adminController.getEventListController);

router.get("/events/entry/:id", adminController.getEventEntryController);

router.delete("/events/entry/:id", adminController.deleteEventEntryController);

export default router;
