import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import UserService from "../../services/user";
const service = new UserService();

interface TokenData {
  id: number;
  email: string;
  iat: number;
  exp: number;
}

interface Req extends Request {
  tokenData: TokenData;
}

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
      res.status(200).json({ token: result["key"], userId: result["id"] });
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
    const result = await service.addCouponService(req.body, tokenInfo);
    if (result["key"] === "success") {
      res.status(201).send("success");
    } else {
      res.status(409).send("duplicate");
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
}
