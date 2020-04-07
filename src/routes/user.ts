import dotenv from "dotenv";
import express from "express";
import UserController from "../controller/user";
import jwt from "jsonwebtoken";
import { ERROR_MESSAGE } from "../common/ErrorMessages";

dotenv.config();
const controller = new UserController();
const router = express.Router({ strict: true });

const jwtCheck = (req, res, next) => {
  const token = req.headers.authorization;
  jwt.verify(token, process.env.JWT_USER_SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(403).json(err ? err : { message: ERROR_MESSAGE.WRONG_TOKEN });
    } else {
      req.tokenData = decoded;
      next();
    }
  });
};

router.get("/userId", jwtCheck, controller.getUserIdController);

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
