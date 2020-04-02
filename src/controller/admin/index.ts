import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import adminService from "../../services/admin";
import { MulterFile, Req } from "../../common/interface";

const service = new adminService();

export default class AdminController {
  async addEventController(
    req: any & { files: MulterFile[] },
    res: Response
  ): Promise<void> {
    const eventData = req.body;
    if (req.files["pageImage"]) {
      eventData.pageImage = req.files["pageImage"][0].location;
      eventData.bannerImage = req.files["bannerImage"][0].location;
      eventData.buttonImage = req.files["buttonImage"][0].location;
    }

    try {
      await service.addEventService(eventData);
      res.status(201).end();
    } catch (err) {
      res.status(409).send(err.message);
    }
  }

  async putEventController(
    req: Request & { files: MulterFile[] },
    res: Response
  ): Promise<void> {
    const eventData = req.body;
    if (req.files["pageImage"]) {
      eventData.pageImage = req.files["pageImage"][0].location;
    }
    if (req.files["bannerImage"]) {
      eventData.bannerImage = req.files["bannerImage"][0].location;
    }
    if (req.files["buttonImage"]) {
      eventData.buttonImage = req.files["buttonImage"][0].location;
    }

    try {
      await service.putEventService(eventData, req.params.eventId);
      res.status(200).end();
    } catch (err) {
      res.status(409).send(err.message);
    }
  }

  async getEventListController(req: Request, res: Response): Promise<void> {
    const result = await service.getEventListService();
    res.status(200).json({ eventList: result });
  }

  async getEventEntryController(req: Request, res: Response): Promise<void> {
    const result = await service.getEventEntryService(req.params.eventId);
    res.status(200).json(result);
  }

  async deleteEventController(req: Request, res: Response): Promise<void> {
    await service.deleteEventService(req.params.eventId);
    res.status(200).end();
  }

  async signinController(req: Request, res: Response): Promise<void> {
    try {
      const result = await service.signinService(req.body);
      res.status(200).json(result);
    } catch (err) {
      res.status(409).send(err.message);
    }
  }

  async createCouponController(req: Request, res: Response): Promise<void> {
    try {
      await service.createCouponService(req.body);
      res.status(201).end();
    } catch (err) {
      res.status(409).send(err.message);
    }
  }

  async getCouponListController(req: Request, res: Response): Promise<void> {
    const couponList = await service.getCouponListService();
    res.status(200).json({
      couponList
    });
  }

  async deleteCouponController(req: Request, res: Response): Promise<void> {
    await service.deleteCouponService(req.params.couponId);
    res.status(200).end();
  }

  async getUserCouponListController(
    req: Request,
    res: Response
  ): Promise<void> {
    const result = await service.getUserCouponListService();
    res.status(200).json(result);
  }

  async getAdminIdController(req: Req, res: Response): Promise<void> {
    const tokenInfo = req.tokenData;
    res.status(200).json({
      id: tokenInfo.id
    });
  }

  async getRoomListController(req: Req, res: Response): Promise<void> {
    const result = await service.getRoomListService();
    res.status(200).json(result);
  }
}
