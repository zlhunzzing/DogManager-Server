import dotenv from "dotenv";
dotenv.config();
import { getRepository } from "typeorm";
import { Events } from "../entity/Events";
import { Admin } from "../entity/Admin";
import { Coupon } from "../entity/Coupon";
import jwt from "jsonwebtoken";

interface EventData {
  eventTitle: string;
  startDate: string;
  endDate: string;
  detailPageUrl: string;
  couponCode: string;
  buttonImage: string;
  bannerImage: string;
  pageImage: string;
  email: string;
  password: string;
}

interface CouponData {
  couponName: string;
  couponCode: string;
  description: string;
  period: number;
  discount: string;
}

export default class AdminService {
  async addEventService(data: EventData): Promise<object> {
    const inData = await getRepository(Events).findOne({
      where: [
        {
          detailPageUrl: data.detailPageUrl
        }
      ]
    });
    if (inData) {
      if (inData.detailPageUrl === data.detailPageUrl) {
        return { key: "detailPageUrl" };
      }
    }
    const events = new Events();
    const forInsertData = {
      ...events,
      ...data,
      detailPageUrl: data.detailPageUrl ? data.detailPageUrl : null,
      couponCode: data.couponCode ? data.couponCode : null
    };
    await getRepository(Events).save(forInsertData);
    return { key: "completed" };
  }

  async putEventService(data: EventData, id: string): Promise<object> {
    const result = await getRepository(Events).findOne({
      where: {
        id
      }
    });
    if (result.detailPageUrl !== data.detailPageUrl) {
      const inData = await getRepository(Events).findOne({
        where: {
          detailPageUrl: data.detailPageUrl
        }
      });
      if (inData) {
        if (inData.detailPageUrl === data.detailPageUrl) {
          return { key: "detailPageUrl" };
        }
      }
    }
    const updatedResult2 = {
      ...result,
      ...data,
      buttonImage: data.buttonImage ? data.buttonImage : result.buttonImage,
      bannerImage: data.bannerImage ? data.bannerImage : result.bannerImage,
      pageImage: data.pageImage ? data.pageImage : result.pageImage
    };
    await getRepository(Events).save(updatedResult2);
    return { key: "completed" };
  }

  async getEventListService(): Promise<object> {
    const result = await getRepository(Events).find({
      select: [
        "id",
        "eventTitle",
        "startDate",
        "endDate",
        "detailPageUrl",
        "bannerImage"
      ],
      where: {
        isDeleted: false
      }
    });
    return result;
  }

  async getEventEntryService(id: string, couponCode: string): Promise<object> {
    const eventInfo = await getRepository(Events).findOne({
      where: {
        id,
        isDeleted: false
      }
    });
    const couponInfo = await getRepository(Coupon).findOne({
      where: {
        couponCode: eventInfo.couponCode
      }
    });
    const couponListInfo = await getRepository(Coupon).find({
      select: ["couponName", "couponCode"]
    });
    const result = {
      ...eventInfo,
      couponName: couponInfo ? couponInfo.couponName : null,
      couponList: couponListInfo ? couponListInfo : null
    };
    return result;
  }

  async deleteEventService(id: string): Promise<void> {
    const result = await getRepository(Events).findOne({
      where: {
        id
      }
    });
    result.isDeleted = true;
    await getRepository(Events).save(result);
  }

  async signinService(data: EventData): Promise<object> {
    const { email, password } = data;

    const result = await getRepository(Admin).findOne({
      where: {
        email,
        password
      }
    });

    if (result) {
      const token = jwt.sign(
        {
          id: result.id,
          email
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1h"
        }
      );
      return { key: token };
    } else {
      return { key: "unvalid user" };
    }
  }

  async createCouponService(data: CouponData): Promise<void> {
    await getRepository(Coupon).save(data);
  }
}
