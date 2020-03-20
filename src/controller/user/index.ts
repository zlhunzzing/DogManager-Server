import { getConnection } from "typeorm";
import { Events } from "../../entity/Events";
import { getRepository } from "typeorm";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserService from "../../services/user";
const service = new UserService();

export default {
  getEventListController: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const result = await service.getEventListService();
    res.status(200).json({ eventList: result });
  },

  getEventEntryController: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const result = await service.getEventEntryService(req.params.url);
    res.status(200).json(result);
  },

  signupController: async (req: Request, res: Response): Promise<void> => {
    const result = await service.signupService(req.body);
    if (result["key"] === "already exist") {
      res.status(409).send("email already exist");
    } else {
      res.status(201).end();
    }
  },

  signinController: async (req: Request, res: Response): Promise<void> => {
    const result = await service.signinService(req.body);
    if (result["key"] === "fail") {
      res.status(409).end();
    } else {
      const token = jwt.sign(
        {
          id: result["key"]
        },
        "@secretKey",
        {
          expiresIn: "1h"
        }
      );
      res.set("Authorization", token);
      res.status(200).json({ id: result["key"] });
    }
  }
};
