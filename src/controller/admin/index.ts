import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import adminService from "../../services/admin";
import jwt from "jsonwebtoken";

const service = new adminService();

export interface MulterFile {
  key: string; // Available using `S3`.
  path: string; // Available using `DiskStorage`.
  mimetype: string;
  originalname: string;
  size: number;
}

const verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
};

export default class AdminController {
  async addEventController(
    req: Request & { files: MulterFile[] },
    res: Response
  ): Promise<void> {
    try {
      const token = req.headers.authorization;
      const userInfo = await verifyToken(token, process.env.JWT_SECRET_KEY);
      const data = req.body;
      if (req.files["pageImage"]) {
        data.pageImage = req.files["pageImage"][0].location;
        data.bannerImage = req.files["bannerImage"][0].location;
        data.buttonImage = req.files["buttonImage"][0].location;
      }
      const result = await service.addEventService(data);
      if (result["key"] === "detailPageUrl") {
        res.status(409).send("detailPageUrl");
      } else {
        res.status(201).end();
      }
    } catch (err) {
      res.status(401).end();
    }
  }

  async putEventController(
    req: Request & { files: MulterFile[] },
    res: Response
  ): Promise<void> {
    try {
      const token = req.headers.authorization;
      const userInfo = await verifyToken(token, process.env.JWT_SECRET_KEY);
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
      const result = await service.putEventService(data, req.params.id);
      if (result["key"] === "detailPageUrl") {
        res.status(409).send("detailPageUrl");
      } else {
        res.status(200).end();
      }
    } catch (err) {
      res.status(401).end();
    }
  }

  async getEventListController(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization;
      const userInfo = await verifyToken(token, process.env.JWT_SECRET_KEY);
      const result = await service.getEventListService();
      res.status(200).json({ eventList: result });
    } catch (err) {
      res.status(401).end();
    }
  }

  async getEventEntryController(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization;
      const userInfo = await verifyToken(token, process.env.JWT_SECRET_KEY);
      const result = await service.getEventEntryService(
        req.params.id,
        req.body.couponCode
      );
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(401).end();
    }
  }

  async deleteEventController(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization;
      const userInfo = await verifyToken(token, process.env.JWT_SECRET_KEY);
      await service.deleteEventService(req.params.id);
      res.status(200).end();
    } catch (err) {
      res.status(401).end();
    }
  }

  async signinController(req: Request, res: Response): Promise<void> {
    const result = await service.signinService(req.body);
    if (result["key"] !== "unvalid user") {
      res.status(200).json({ token: result["key"] });
    } else {
      res.status(409).send("unvaild user");
    }
  }

  async createCouponController(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization;
      const userInfo = await verifyToken(token, process.env.JWT_SECRET_KEY);
      const result = await service.createCouponService(req.body);
      if (result) {
        if (result["key"] === "couponName already exist") {
          res.status(409).send("couponName already exist");
        } else if (result["key"] === "couponCode already exist") {
          res.status(409).send("couponCode already exist");
        }
      }
      res.status(201).end();
    } catch (err) {
      res.status(401).end();
    }
  }

  async getCouponListController(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization;
      const userInfo = await verifyToken(token, process.env.JWT_SECRET_KEY);
      const couponList = await service.getCouponListService();
      res.status(200).json({
        couponList
      });
    } catch (err) {
      res.status(401).end();
    }
  }
}
