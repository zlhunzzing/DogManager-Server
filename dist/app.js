"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const typeorm_1 = require("typeorm");
const User_1 = require("./entity/User");
const admin_1 = require("./routes/admin");
const user_1 = require("./routes/user");
const cors = require("cors");
// create typeorm connection
typeorm_1.createConnection().then(connection => {
    const userRepository = connection.getRepository(User_1.User);
    // create and setup express app
    const app = express();
    const PORT = 3000;
    app.use(bodyParser.json());
    app.use(cors());
    app.use("/", (req, res) => res.send("hello"));
    app.use("/user", user_1.default);
    app.use("/admin", admin_1.default);
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
