import * as express from "express";
import { Request, Response } from "express";
import * as bodyParser from "body-parser";
import { createConnection } from "typeorm";
import adminRouter from "./routes/admin";
import userRouter from "./routes/user";
import * as cors from "cors";
import { createTypeormConnection } from "./utils/createTypeormConnection";

// create typeorm connection
// export const startServer = async () => {
// await createTypeormConnection();
const app = express();
const PORT: number = 3000;
app.use(bodyParser.json());
app.use(cors());
// app.use(async (req, res, next) => {
//   await createTypeormConnection();
//   next();
// });
if (process.env.NODE_ENV === "development") {
  createTypeormConnection();
}
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.get("/test", (req, res) =>
  res.json({
    data: "this is data"
  })
);
// start express server
app.listen(PORT, async () => {
  // await createTypeormConnection();
  console.log(`app is listening in port ${PORT}`);
});

export default app;
// };

// startServer();
