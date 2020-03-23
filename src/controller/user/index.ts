import dotenv from "dotenv";
dotenv.config();
// import { getConnection } from "typeorm";
// import { Events } from "../../entity/Events";
// import { getRepository } from "typeorm";
import { Request, Response } from "express";
import UserService from "../../services/user";
const service = new UserService();
import jwt from "jsonwebtoken";

export default class UserController {
  async getEventListController(req: Request, res: Response): Promise<void> {
    const result = await service.getEventListService();
    res.status(200).json({ eventList: result });
  }

  async getEventEntryController(req: Request, res: Response): Promise<void> {
    const result = await service.getEventEntryService(req.params.url);
    res.status(200).json(result);
  }

  async signupController(req: Request, res: Response): Promise<void> {
    const result = await service.signupService(req.body);
    if (result["key"] === "already exist") {
      res.status(409).send("email already exist");
    } else {
      res.status(201).end();
    }
  }

  async signinController(req: Request, res: Response): Promise<void> {
    const result = await service.signinService(req.body);
    if (result["key"] === "unvalid user") {
      res.status(409).send("unvalid user");
    } else {
      res.status(200).json({ token: result["key"] });
    }
  }
}
