import * as express from "express";
import UserController from "../controller/user";
const controller = new UserController();
const router = express.Router({ strict: true });

router.get("/events/list", controller.getEventListController);

router.get("/events/entry/:url", controller.getEventEntryController);

router.post("/signup", controller.signupController);

router.post("/signin", controller.signinController);

router.post("/coupon", controller.addCouponController);

// router.get("/coupon/list", controller.getCouponListController);

export default router;
