import * as express from "express";
import AdminController from "../controller/admin";
const controller = new AdminController();
const router = express.Router({ strict: true });

import AWS from "aws-sdk";
import path from "path";
import multer from "multer";
import multerS3 from "multer-s3";
AWS.config.loadFromPath(__dirname + "/../../awsconfig.json");

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

router.post(
  "/events/entry",
  upload.fields(option),
  controller.addEventController
);

router.get("/events/list", controller.getEventListController);

router.get("/events/entry/:id", controller.getEventEntryController);

router.delete("/events/entry/:id", controller.deleteEventController);

router.put(
  "/events/entry/:id",
  upload.fields(option),
  controller.putEventController
);

router.post("/coupon", controller.createCouponController);

router.get("/coupon/list", controller.getCouponListController);

router.post("/signin", controller.signinController);

router.delete("/coupon/:id", controller.deleteCouponController);

export default router;
