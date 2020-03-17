"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const controller_1 = __importDefault(require("../controller"));
const adminController = controller_1.default.adminController;
const router = express.Router({ strict: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
aws_sdk_1.default.config.loadFromPath(__dirname + "/../../awsconfig.json");
const s3 = new aws_sdk_1.default.S3();
const upload = multer_1.default({
    storage: multer_s3_1.default({
        s3,
        bucket: "dogmate-image",
        key: (req, file, cb) => {
            const extension = path_1.default.extname(file.originalname);
            cb(null, Date.now().toString() + extension);
        },
        acl: "public-read-write"
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
    { name: "buttonUrl", maxCount: 5 }
];
router.post("/events/entry", upload.fields(option), adminController.addEventController);
router.get("/events/list", adminController.getEventListController);
router.get("/events/entry/:id", adminController.getEventEntryController);
router.delete("/events/entry/:id", adminController.deleteEventController);
router.put("/events/entry/:id", upload.fields(option), adminController.putEventController);
exports.default = router;
