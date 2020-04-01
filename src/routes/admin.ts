import dotenv from "dotenv";
dotenv.config();
import * as express from "express";
import AdminController from "../controller/admin";
const controller = new AdminController();
const router = express.Router({ strict: true });
import AWS from "aws-sdk";
import path from "path";
import multer from "multer";
import multerS3 from "multer-s3";
AWS.config.loadFromPath(__dirname + "/../../awsconfig.json");
import jwt from "jsonwebtoken";

const jwtCheck = (req, res, next) => {
  const token = req.headers.authorization;

  jwt.verify(token, process.env.JWT_ADMIN_SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(403).json(err ? err : { message: "Wrong token!" });
    } else {
      req.tokenData = decoded;
      next();
    }
  });
};

const s3 = new AWS.S3();
const upload = multer({
  storage: multerS3({
    s3,
    bucket: "dogmate-image",
    key: (req, file, cb) => {
      const extension = path.extname(file.originalname);
      cb(null, Date.now().toString() + extension);
    },
    acl: "public-read-write",
    limits: { fileSize: 5 * 1024 * 1024 }
  })
  // dest: "../uploads"
});

const option = [
  { name: "eventTitle", maxCount: 5 },
  { name: "startDate", maxCount: 5 },
  { name: "endDate", maxCount: 5 },
  { name: "pageImage", maxCount: 5 },
  { name: "bannerImage", maxCount: 5 },
  { name: "buttonImage", maxCount: 5 },
  { name: "detailPageUrl", maxCount: 5 },
  { name: "couponCode", maxCount: 5 }
];

router.get("/adminId", jwtCheck, controller.getAdminIdController);

router.post(
  "/events/entry",
  jwtCheck,
  upload.fields(option),
  controller.addEventController
);

router.get("/events/list", jwtCheck, controller.getEventListController);

router.get(
  "/events/entry/:eventId",
  jwtCheck,
  controller.getEventEntryController
);

router.delete(
  "/events/entry/:eventId",
  jwtCheck,
  controller.deleteEventController
);

router.put(
  "/events/entry/:eventId",
  jwtCheck,
  upload.fields(option),
  controller.putEventController
);

router.post("/coupon", jwtCheck, controller.createCouponController);

router.get("/coupon/list", jwtCheck, controller.getCouponListController);

router.post("/signin", controller.signinController);

router.delete("/coupon/:couponId", jwtCheck, controller.deleteCouponController);

router.get(
  "/user/coupon/list",
  jwtCheck,
  controller.getUserCouponListController
);

router.get("/room/list", jwtCheck, controller.getRoomListController);

export default router;
