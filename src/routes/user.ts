import * as express from "express";
import controller from "../controller";
const userController = controller.userController;
const router = express.Router({ strict: true });

router.get("/events/list", userController.getEventListController);

router.get("/events/entry/:url", userController.getEventEntryController);

// router.post("/signup", userController.signupController);

// router.post("/signin", userController.signinController);

// router.post("/coupon", userController.addCouponController);

// router.get("/coupon/list", userController.getCouponListController);

export default router;
