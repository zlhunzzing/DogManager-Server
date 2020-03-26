import dotenv from "dotenv";
dotenv.config();
// import { getConnection } from "typeorm";
// import { Events } from "../../entity/Events";
// import { getRepository } from "typeorm";
import { Request, Response } from "express";
import UserService from "../../services/user";
const service = new UserService();
import jwt from "jsonwebtoken";

const verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
};

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
      res.status(200).json({ token: result["key"], userId: result["id"] });
    }
  }

  async getCouponListController(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization;
      const tokenInfo = await verifyToken(
        token,
        process.env.JWT_USER_SECRET_KEY
      );
      const result = await service.getCouponListService(tokenInfo);
      res.status(200).json({
        couponList: result
      });
    } catch (err) {
      res.status(401).end();
    }
  }

  async addCouponController(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization;
      const userInfo = await verifyToken(
        token,
        process.env.JWT_USER_SECRET_KEY
      );
      const result = await service.addCouponService(req.body, userInfo);
      if (result["key"] === "success") {
        res.status(201).send("success");
      } else {
        res.status(409).send("duplicate");
      }
    } catch (err) {
      res.status(401).end();
    }
  }

  async deleteCommentController(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization;
      const userInfo = await verifyToken(
        token,
        process.env.JWT_USER_SECRET_KEY
      );
      await service.deleteCommentService(req.params.commentId);
      res.status(200).end();
    } catch (err) {
      res.status(401).end();
    }
  }

  async updateCommentController(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization;
      const userInfo = await verifyToken(
        token,
        process.env.JWT_USER_SECRET_KEY
      );
      await service.updateCommentService(req.body, req.params.commentId);
      res.status(200).end();
    } catch (err) {
      res.status(401).end();
    }
  }
}
