import dotenv from "dotenv";
dotenv.config();
import { getConnection } from "typeorm";
import { getRepository } from "typeorm";
import { Events } from "../entity/Events";
import { Admin } from "../entity/Admin";
import jwt from "jsonwebtoken";

interface BodyType {
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

export default class AdminService {
  async addEventService(data: BodyType): Promise<object> {
    const indata = await getRepository(Events).findOne({
      where: [
        {
          detailPageUrl: data.detailPageUrl
        }
      ]
    });
    if (indata) {
      if (indata.detailPageUrl === data.detailPageUrl) {
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

  async putEventService(data: BodyType, id: string): Promise<object> {
    const result = await getRepository(Events).findOne({
      where: {
        id
      }
    });
    if (result.detailPageUrl !== data.detailPageUrl) {
      const indata = await getRepository(Events).findOne({
        where: {
          detailPageUrl: data.detailPageUrl
        }
      });
      if (indata) {
        if (indata.detailPageUrl === data.detailPageUrl) {
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

  async getEventEntryService(id: string): Promise<object> {
    const result = await getRepository(Events).findOne({
      where: {
        id,
        isDeleted: false
      }
    });
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

  async signinService(data: BodyType): Promise<object> {
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
}
