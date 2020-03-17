import { Request, Response } from "express";
import adminService from "../../service/admin";

const service = new adminService();

export interface MulterFile {
  key: string; // Available using `S3`.
  path: string; // Available using `DiskStorage`.
  mimetype: string;
  originalname: string;
  size: number;
}

export default {
  addEventController: async (
    req: Request & { files: MulterFile[] },
    res: Response
  ): Promise<void> => {
    const data = req.body;
    data.pageImage = req.files["pageImage"][0].location;
    data.bannerImage = req.files["bannerImage"][0].location;
    data.buttonImage = req.files["buttonImage"][0].location;
    const result = await service.addEventService(data);
    if (result["key"] === "detailPageUrl") {
      res.status(409).send("detailPageUrl");
    } else if (result["key"] === "buttonUrl") {
      res.status(409).send("buttonUrl");
    } else {
      res.status(201).end();
    }
    // res.status(201).end();
  },

  putEventController: async (
    req: Request & { files: MulterFile[] },
    res: Response
  ): Promise<void> => {
    const data = req.body;
    if (req.files["pageImage"]) {
      data.pageImage = req.files["pageImage"][0].location;
    }
    if (req.files["bannerImage"]) {
      data.bannerImage = req.files["bannerImage"][0].location;
    }
    if (req.files["buttonImage"]) {
      data.buttonImage = req.files["buttonImage"][0].location;
    }
    await service.putEventService(data, req.params.id);
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
