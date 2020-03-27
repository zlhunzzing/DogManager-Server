import * as express from "express";
import UserController from "../controller/user";
const controller = new UserController();
const router = express.Router({ strict: true });

router.get("/events/list", controller.getEventListController);

router.get("/events/entry/:url", controller.getEventEntryController);

router.post("/signup", controller.signupController);

router.post("/signin", controller.signinController);

router.post("/coupon", controller.addCouponController);

router.get("/coupon/list", controller.getCouponListController);

router.delete("/comment/entry/:commentId", controller.deleteCommentController);

router.put("/comment/entry/:commentId", controller.updateCommentController);

router.post("/comment/entry", controller.addCommentController);

router.post("/comment/entry/thumb/:commentId", controller.addThumbController);

router.delete(
  "/comment/entry/thumb/:commentId",
  controller.removeThumbController
);

router.get("/thumb/list/:eventUrl", controller.getUserThumbsListController);

export default router;
