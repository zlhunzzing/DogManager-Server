import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import UserService from "../../services/user";
import { Req } from "../../common/interface";

const service = new UserService();

export default class UserController {
  async getEventListController(req: Request, res: Response): Promise<void> {
    const result = await service.getEventListService();
    res.status(200).json({ eventList: result });
  }

  async getEventEntryController(req: Request, res: Response): Promise<void> {
    const result = await service.getEventEntryService(req.params.eventUrl);
    res.status(200).json(result);
  }

  async signupController(req: Request, res: Response): Promise<void> {
    try {
      await service.signupService(req.body);
      res.status(201).end();
    } catch (err) {
      res.status(409).send(err.message);
    }
  }

  async signinController(req: Request, res: Response): Promise<void> {
    try {
      const result = await service.signinService(req.body);
      res.status(200).json(result);
    } catch (err) {
      res.status(409).send(err.message);
    }
  }

  async getCouponListController(req: Req, res: Response): Promise<void> {
    const tokenInfo = req.tokenData;
    const result = await service.getCouponListService(tokenInfo);
    res.status(200).json({
      couponList: result
    });
  }

  async addCouponController(req: Req, res: Response): Promise<void> {
    const tokenInfo = req.tokenData;
    try {
      await service.addCouponService(req.body, tokenInfo);
      res.status(201).send("success");
    } catch (err) {
      res.status(409).send(err.message);
    }
  }

  async deleteCommentController(req: Request, res: Response): Promise<void> {
    const result = await service.deleteCommentService(req.params.commentId);
    res.status(200).json(result);
  }

  async addCommentController(req: Req, res: Response): Promise<void> {
    const tokenInfo = req.tokenData;
    const result = await service.addCommentService(req.body, tokenInfo);
    res.status(201).json(result);
  }

  async updateCommentController(req: Req, res: Response): Promise<void> {
    const tokenInfo = req.tokenData;
    const result = await service.updateCommentService(
      req.body,
      req.params.commentId,
      tokenInfo
    );
    res.status(200).json(result);
  }

  async addThumbController(req: Req, res: Response): Promise<void> {
    const tokenInfo = req.tokenData;
    const result = await service.addThumbService(
      req.params.commentId,
      tokenInfo
    );
    res.status(200).json(result);
  }

  async removeThumbController(req: Req, res: Response): Promise<void> {
    const tokenInfo = req.tokenData;
    const result = await service.removeThumbService(
      req.params.commentId,
      tokenInfo
    );
    res.status(200).json(result);
  }

  async getUserThumbsListController(req: Req, res: Response): Promise<void> {
    const tokenInfo = req.tokenData;
    const result = await service.getUserThumbsListService(
      req.params.eventUrl,
      tokenInfo
    );
    res.status(200).json(result);
  }

  async getUserIdController(req: Req, res: Response): Promise<void> {
    const tokenInfo = req.tokenData;
    res.status(200).json({
      id: tokenInfo.id
    });
  }
}
