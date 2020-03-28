import * as express from "express";
import UserController from "../controller/user";
const controller = new UserController();
const router = express.Router({ strict: true });
import jwtMiddleware from "express-jwt-middleware";
const jwtCheck = jwtMiddleware(process.env.JWT_SECRET_KEY);

router.get("/events/list", controller.getEventListController);

router.get("/events/entry/:eventUrl", controller.getEventEntryController);

router.post("/signup", controller.signupController);

router.post("/signin", controller.signinController);

router.post("/coupon", jwtCheck, controller.addCouponController);

router.get("/coupon/list", jwtCheck, controller.getCouponListController);

router.delete(
  "/comment/entry/:commentId",
  jwtCheck,
  controller.deleteCommentController
);

router.put(
  "/comment/entry/:commentId",
  jwtCheck,
  controller.updateCommentController
);

router.post("/comment/entry", jwtCheck, controller.addCommentController);

router.post(
  "/comment/entry/thumb/:commentId",
  jwtCheck,
  controller.addThumbController
);

router.delete(
  "/comment/entry/thumb/:commentId",
  jwtCheck,
  controller.removeThumbController
);

router.get(
  "/thumb/list/:eventUrl",
  jwtCheck,
  controller.getUserThumbsListController
);

export default router;
