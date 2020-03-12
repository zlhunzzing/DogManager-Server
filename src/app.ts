import * as express from "express";
import { Request, Response } from "express";
import * as bodyParser from "body-parser";
import { createConnection } from "typeorm";
import adminRouter from "./routes/admin";
import userRouter from "./routes/user";
import * as cors from "cors";

// create typeorm connection
createConnection().then(() => {
  // create and setup express app
  const app = express();
  const PORT: number = 3000;
  app.use(bodyParser.json());
  app.use(cors());

  app.use("/api/user", userRouter);
  app.use("/api/admin", adminRouter);

  // start express server
  app.listen(PORT, () => console.log(`app is listening in port ${PORT}`));
});
