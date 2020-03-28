import dotenv from "dotenv";
dotenv.config();
import { getRepository } from "typeorm";
import { Events } from "../database/entity/Events";
import { Admin } from "../database/entity/Admin";
import { Coupon } from "../database/entity/Coupon";
import { UserCoupon } from "../database/entity/UserCoupon";
import { User } from "../database/entity/User";
import jwt from "jsonwebtoken";

enum couponState {
  enable,
  disable,
  canceled
}

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

const getTime = time => {
  const year = time.getFullYear();
  let month = (time.getMonth() + 1).toString();
  month = Number(month) < 10 ? "0" + month : month;
  let date = time.getDate();
  date = Number(date) < 10 ? "0" + date : date;
  let hour = time.getHours();
  hour = Number(hour) < 10 ? "0" + hour : hour;
  let minute = time.getMinutes();
  minute = Number(minute) < 10 ? "0" + minute : minute;
  const result2 = "" + year + month + date + hour + minute;
  return result2;
};

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

  async createCouponService(data: CouponData): Promise<object> {
    const result = await getRepository(Coupon).findOne({
      where: [
        {
          couponName: data.couponName
        },
        {
          couponCode: data.couponCode
        }
      ]
    });
    if (result) {
      if (result.couponName === data.couponName) {
        return { key: "couponName already exist" };
      } else if (result.couponCode === data.couponCode) {
        return { key: "couponCode already exist" };
      }
    }
    await getRepository(Coupon).save(data);
  }

  async getCouponListService(): Promise<object> {
    const couponList = await getRepository(Coupon).find({
      where: {
        isDeleted: false
      }
    });
    return couponList;
  }

  async deleteCouponService(id): Promise<void> {
    // Coupon 테이블에서 해당 쿠폰 isDeleted 를 true로 변경
    const result = await getRepository(Coupon).findOne({
      where: {
        id
      }
    });
    result.isDeleted = true;
    await getRepository(Coupon).save(result);

    // UserCoupon 테이블에서 해당쿠폰이 들어간 모든 열의 isDeleted를
    // couponState.canceled 로 변경
    const UserCouponList = await getRepository(UserCoupon).find({
      where: {
        couponId: result.id
      }
    });
    const result2 = await UserCouponList.map(x => {
      x.isDeleted = couponState.canceled;
      return x;
    });
    await getRepository(UserCoupon).save(result2);
  }

  async getUserCouponListService(): Promise<object> {
    const userCouponInfo = await getRepository(UserCoupon).find();

    const userInfo = await getRepository(User).find({
      select: ["id", "name", "email"],
      where: userCouponInfo.map(x => {
        return {
          id: x.userId
        };
      })
    });

    const couponInfo = await getRepository(Coupon).find({
      select: ["id", "couponName", "couponCode"],
      where: userCouponInfo.map(x => {
        return {
          id: x.couponId
        };
      })
    });
    /////////////////////

    const result = userCouponInfo.map(x => {
      const filteredUserInfo = userInfo.filter(y => {
        return y.id === x.userId;
      });
      const filteredCouponInfo = couponInfo.filter(y => {
        return y.id === x.couponId;
      });

      const time = new Date(x.createdAt.toString());
      const timeData = getTime(time);

      return {
        userName: filteredUserInfo[0].name,
        userEmail: filteredUserInfo[0].email,
        couponName: filteredCouponInfo[0].couponName,
        couponCode: filteredCouponInfo[0].couponCode,
        assignedAt: timeData,
        expiredAt: x.expiredAt,
        isDeletedAt: x.isDeleted
      };
    });
    return { key: result };
  }
}
