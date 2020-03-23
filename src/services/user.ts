import dotenv from "dotenv";
dotenv.config();
import { getRepository } from "typeorm";
import { Events } from "../entity/Events";
import { User } from "../entity/User";
import { Coupon } from "../entity/Coupon";
import { UserCoupon } from "../entity/UserCoupon";
import crypto from "crypto";
import jwt from "jsonwebtoken";

interface SignupData {
  name: string;
  email: string;
  password: string;
  mobile: string;
  address: string;
}

interface SigninData {
  email: string;
  password: string;
}

interface CouponData {
  couponName: string;
  couponCode: string;
  description: string;
  period: number;
  discount: string;
  expiredAt: string;
}

export default class UserService {
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

  async getEventEntryService(url: string): Promise<object> {
    const eventInfo = await getRepository(Events).findOne({
      where: {
        detailPageUrl: `/${url}`,
        isDeleted: false
      }
    });
    const couponInfo = await getRepository(Coupon).findOne({
      where: {
        couponCode: eventInfo.couponCode
      }
    });
    const result = {
      ...eventInfo,
      period: couponInfo.period
    };
    return result;
  }

  async signupService(data: SignupData): Promise<object> {
    const result = await getRepository(User).findOne({
      where: {
        email: data.email
      }
    });
    if (result) {
      return { key: "already exist" };
    }
    const shasum = crypto.createHmac("sha512", "@thisissecretkey");
    shasum.update(data.password);
    data.password = shasum.digest("hex");
    const user = new User();
    const forInsertData = {
      ...user,
      ...data
    };
    await getRepository(User).save(forInsertData);
    return { key: "completed" };
  }

  async signinService(data: SigninData): Promise<object> {
    const shasum = crypto.createHmac("sha512", "@thisissecretkey");
    shasum.update(data.password);
    data.password = shasum.digest("hex");
    const result = await getRepository(User).findOne({
      where: {
        email: data.email,
        password: data.password
      }
    });
    if (result) {
      const token = jwt.sign(
        {
          id: result.id,
          email: result.email
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

  async addCouponService(data: CouponData, info): Promise<object> {
    // // 해당 이벤트의 쿠폰정보를 조회
    const coupon = await getRepository(Coupon).findOne({
      where: {
        couponCode: data.couponCode
      }
    });
    // // 조회한 쿠폰을 이미 가지고 있을 경우 중복처리
    const inData = await getRepository(UserCoupon).findOne({
      where: {
        userId: info.id,
        couponId: coupon.id
      }
    });
    if (inData) {
      console.log("중복");
      return { key: "duplicate" };
    }
    // 쿠폰을 생성
    const forInsertData = {
      couponId: coupon.id,
      userId: info.id,
      expiredAt: data.expiredAt,
      isDeleted: 1
    };
    await getRepository(UserCoupon).save(forInsertData);
    return { key: "success" };
  }
}
