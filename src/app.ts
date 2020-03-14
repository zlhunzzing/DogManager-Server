import * as express from "express";
import { Request, Response } from "express";
import * as bodyParser from "body-parser";
import { createConnection } from "typeorm";
import adminRouter from "./routes/admin";
import userRouter from "./routes/user";
import * as cors from "cors";
import { createTypeormConnection } from "./utils/createTypeormConnection";

const app = express();
const PORT: number = 3000;
app.use(bodyParser.json());
app.use(cors());

if (process.env.NODE_ENV !== "test") {
  createTypeormConnection();
}
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

// start express server
app.listen(PORT, async () => {
  console.log(`app is listening in port ${PORT}`);
});

export default app;
