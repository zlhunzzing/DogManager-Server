import { Request, Response } from "express";
import adminService from "../../service/admin";

const service = new adminService();

export default {
  addEventController: async (req: Request, res: Response): Promise<void> => {
    await service.addEventService(req.body);
    res.status(201).end();
  },

  putEventController: async (req: Request, res: Response): Promise<void> => {
    await service.putEventService(req.body, req.params.id);
    res.status(200).end();
  },

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
    const result = await service.getEventEntryService(req.params.id);
    res.status(200).json(result);
  },

  deleteEventController: async (req: Request, res: Response): Promise<void> => {
    await service.deleteEventService(req.params.id);
    res.status(200).end();
  }
};
