import { Request, Response } from "express";
import adminService from "../../service/admin";

export default {
  addEventController: async (req: Request, res: Response) => {
    await adminService.addEventService(req.body);
    res.status(201).end();
  },

  putEventController: async (req: Request, res: Response) => {
    await adminService.putEventService(req.body, req.params.id);
    res.status(200).end();
  },

  getEventListController: async (req: Request, res: Response) => {
    const result = await adminService.getEventListService();
    res.status(200).json({ eventList: result });
  },

  getEventEntryController: async (req: Request, res: Response) => {
    const result = await adminService.getEventEntryService(req.params.id);
    res.status(200).json(result);
  },

  deleteEventController: async (req: Request, res: Response) => {
    adminService.deleteEventService(req.params.id);
    res.status(200).end();
  }
};
