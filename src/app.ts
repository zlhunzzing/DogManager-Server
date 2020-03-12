import * as express from "express";
import { Request, Response } from "express";
import * as bodyParser from "body-parser";
import { createConnection } from "typeorm";
import { User } from "./entity/User";
import adminRouter from "./routes/admin";
import userRouter from "./routes/user";
import * as cors from "cors";

// create typeorm connection
createConnection().then(connection => {
  const userRepository = connection.getRepository(User);

  // create and setup express app
  const app = express();
  const PORT = 3000;
  app.use(bodyParser.json());
  app.use(cors());

  app.use("/", (req, res) => res.send("hello"));
  app.use("/user", userRouter);
  app.use("/admin", adminRouter);

  // typeORM 예시 코드

  //   app.get("/users", async function(req: Request, res: Response) {
  //     const users = await userRepository.find();
  //     res.json(users);
  //   });

  //   app.get("/users/:id", async function(req: Request, res: Response) {
  //     const results = await userRepository.findOne(req.params.id);
  //     return res.send(results);
  //   });

  //   app.post("/users", async function(req: Request, res: Response) {
  //     const user = await userRepository.create(req.body);
  //     const results = await userRepository.save(user);
  //     return res.send(results);
  //   });

  //   app.put("/users/:id", async function(req: Request, res: Response) {
  //     const user = await userRepository.findOne(req.params.id);
  //     userRepository.merge(user, req.body);
  //     const results = await userRepository.save(user);
  //     return res.send(results);
  //   });

  //   app.delete("/users/:id", async function(req: Request, res: Response) {
  //     const results = await userRepository.delete(req.params.id);
  //     return res.send(results);
  //   });

  // start express server
  app.listen(PORT, () => console.log(`app is listening in port ${PORT}`));
});
