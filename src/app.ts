import express from "express";
import { Request, Response } from "express";
import bodyParser from "body-parser";
import { createConnection } from "typeorm";
import adminRouter from "./routes/admin";
import userRouter from "./routes/user";
import cors from "cors";
import { createTypeormConnection } from "./utils/createTypeormConnection";
import AWS from "aws-sdk";
import path from "path";
import multer from "multer";
import multerS3 from "multer-s3";
AWS.config.loadFromPath(__dirname + "/../awsconfig.json");

const s3 = new AWS.S3();
const upload = multer({
  storage: multerS3({
    s3,
    bucket: "dogmate-image",
    key: (req, file, cb) => {
      const extension = path.extname(file.originalname);
      cb(null, Date.now().toString() + extension);
    },
    acl: "public-read-write"
  })
});

const app = express();
const PORT: number = 3000;
app.use(bodyParser.json());
app.use(cors());

if (process.env.NODE_ENV !== "test") {
  createTypeormConnection();
}
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.post("/upload", upload.single("imgFile"), (req, res, next) => {
  const imgFile = req.file;
  console.log(imgFile);
  res.json(imgFile);
});

// start express server
app.listen(PORT, async () => {
  console.log(`app is listening in port ${PORT}`);
});

export default app;
