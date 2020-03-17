import { getConnection } from "typeorm";
import { Events } from "../../entity/Events";
import { getRepository } from "typeorm";
import { Request, Response } from "express";

import UserService from "../../service/user";
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
  }
};
