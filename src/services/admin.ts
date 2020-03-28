import dotenv from "dotenv";
dotenv.config();
import { getRepository } from "typeorm";
import { Events } from "../database/entity/Events";
import { Admin } from "../database/entity/Admin";
import { Coupon } from "../database/entity/Coupon";
import { UserCoupon } from "../database/entity/UserCoupon";
import { User } from "../database/entity/User";
import jwt from "jsonwebtoken";
import AdminModels from "../models/admin";

const adminModels = new AdminModels();

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
  async addEventService(eventData: EventData): Promise<object> {
    // const inData = await getRepository(Events).findOne({
    //   where: [
    //     {
    //       detailPageUrl: eventData.detailPageUrl
    //     }
    //   ]
    // });
    // if (inData) {
    //   if (inData.detailPageUrl === eventData.detailPageUrl) {
    //     return { key: "detailPageUrl" };
    //   }
    // }
    // const events = new Events();
    // const forInsertData = {
    //   ...events,
    //   ...eventData,
    //   detailPageUrl: eventData.detailPageUrl ? eventData.detailPageUrl : null,
    //   couponCode: eventData.couponCode ? eventData.couponCode : null
    // };
    // await getRepository(Events).save(forInsertData);
    // return { key: "completed" };

    const inData = await adminModels.eventFindOneDetailPage(
      eventData.detailPageUrl
    );
    if (inData) {
      if (inData.detailPageUrl === eventData.detailPageUrl) {
        return { key: "detailPageUrl" };
      }
    }
    const events = new Events();
    const forInsertData = {
      ...events,
      ...eventData,
      detailPageUrl: eventData.detailPageUrl ? eventData.detailPageUrl : null,
      couponCode: eventData.couponCode ? eventData.couponCode : null
    };
    await adminModels.eventSave(forInsertData);
    return { key: "completed" };
  }

  async putEventService(
    eventData: EventData,
    eventId: string
  ): Promise<object> {
    // const result = await getRepository(Events).findOne({
    //   where: {
    //     id: eventId
    //   }
    // });
    // if (result.detailPageUrl !== eventData.detailPageUrl) {
    //   const inData = await getRepository(Events).findOne({
    //     where: {
    //       detailPageUrl: eventData.detailPageUrl
    //     }
    //   });
    //   if (inData) {
    //     if (inData.detailPageUrl === eventData.detailPageUrl) {
    //       return { key: "detailPageUrl" };
    //     }
    //   }
    // }
    // const updatedResult2 = {
    //   ...result,
    //   ...eventData,
    //   buttonImage: eventData.buttonImage ? eventData.buttonImage : result.buttonImage,
    //   bannerImage: eventData.bannerImage ? eventData.bannerImage : result.bannerImage,
    //   pageImage: eventData.pageImage ? eventData.pageImage : result.pageImage
    // };
    // await getRepository(Events).save(updatedResult2);
    // return { key: "completed" };

    const result = await adminModels.eventFindOneId(eventId);

    if (result.detailPageUrl !== eventData.detailPageUrl) {
      const inData = await adminModels.eventFindOneDetailPage(
        eventData.detailPageUrl
      );
      if (inData) {
        if (inData.detailPageUrl === eventData.detailPageUrl) {
          return { key: "detailPageUrl" };
        }
      }
    }
    const updatedResult = {
      ...result,
      ...eventData,
      buttonImage: eventData.buttonImage
        ? eventData.buttonImage
        : result.buttonImage,
      bannerImage: eventData.bannerImage
        ? eventData.bannerImage
        : result.bannerImage,
      pageImage: eventData.pageImage ? eventData.pageImage : result.pageImage
    };
    await adminModels.eventSave(updatedResult);
    return { key: "completed" };
  }

  async getEventListService(): Promise<object> {
    // const result = await getRepository(Events).find({
    //   select: [
    //     "id",
    //     "eventTitle",
    //     "startDate",
    //     "endDate",
    //     "detailPageUrl",
    //     "bannerImage"
    //   ],
    //   where: {
    //     isDeleted: false
    //   }
    // });
    // return result;

    const result = await adminModels.eventFind();
    return result;
  }

  async getEventEntryService(eventId: string): Promise<object> {
    // const eventInfo = await getRepository(Events).findOne({
    //   where: {
    //     id: eventId
    //     isDeleted: false
    //   }
    // });
    // const couponInfo = await getRepository(Coupon).findOne({
    //   where: {
    //     couponCode: eventInfo.couponCode
    //   }
    // });
    // const couponListInfo = await getRepository(Coupon).find({
    //   select: ["couponName", "couponCode"]
    // });
    // const result = {
    //   ...eventInfo,
    //   couponName: couponInfo ? couponInfo.couponName : null,
    //   couponList: couponListInfo ? couponListInfo : null
    // };
    // return result;

    const eventInfo = await adminModels.eventFindOneId(eventId);
    const couponInfo = await adminModels.couponFindOneCouponCode(
      eventInfo.couponCode
    );
    const couponListInfo = await adminModels.couponFindAll();
    const result = {
      ...eventInfo,
      couponName: couponInfo ? couponInfo.couponName : null,
      couponList: couponListInfo ? couponListInfo : null
    };
    return result;
  }

  async deleteEventService(eventId: string): Promise<void> {
    // const result = await getRepository(Events).findOne({
    //   where: {
    //     id: eventId
    //   }
    // });
    // result.isDeleted = true;
    // await getRepository(Events).save(result);

    const result = await adminModels.eventFindOneId(eventId);
    result.isDeleted = true;
    await adminModels.eventSave(result);
  }

  async signinService(adminInfo: EventData): Promise<object> {
    // const { email, password } = adminInfo;

    // const result = await getRepository(Admin).findOne({
    //   where: {
    //     email,
    //     password
    //   }
    // });

    // if (result) {
    //   const token = jwt.sign(
    //     {
    //       id: result.id,
    //       email
    //     },
    //     process.env.JWT_SECRET_KEY,
    //     {
    //       expiresIn: "1h"
    //     }
    //   );
    //   return { key: token };
    // } else {
    //   return { key: "unvalid user" };
    // }

    const { email, password } = adminInfo;

    const result = await adminModels.adminFindOneAccount(email, password);

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

  async createCouponService(couponData: CouponData): Promise<object> {
    // const result = await getRepository(Coupon).findOne({
    //   where: [
    //     {
    //       couponName: couponData.couponName
    //     },
    //     {
    //       couponCode: couponData.couponCode
    //     }
    //   ]
    // });
    // if (result) {
    //   if (result.couponName === couponData.couponName) {
    //     return { key: "couponName already exist" };
    //   } else if (result.couponCode === couponData.couponCode) {
    //     return { key: "couponCode already exist" };
    //   }
    // }
    // await getRepository(Coupon).save(couponData);

    const result = await adminModels.couponFindOneNameOrCode(
      couponData.couponName,
      couponData.couponCode
    );
    if (result) {
      if (result.couponName === couponData.couponName) {
        return { key: "couponName already exist" };
      } else if (result.couponCode === couponData.couponCode) {
        return { key: "couponCode already exist" };
      }
    }
    await adminModels.couponSave(couponData);
  }

  async getCouponListService(): Promise<object> {
    // const couponList = await getRepository(Coupon).find({
    //   where: {
    //     isDeleted: false
    //   }
    // });
    // return couponList;

    const couponList = await adminModels.couponFindAll();
    return couponList;
  }

  async deleteCouponService(couponId): Promise<void> {
    // // Coupon 테이블에서 해당 쿠폰 isDeleted 를 true로 변경
    // const result = await getRepository(Coupon).findOne({
    //   where: {
    //     id: couponId
    //   }
    // });
    // result.isDeleted = true;
    // await getRepository(Coupon).save(result);

    // // UserCoupon 테이블에서 해당쿠폰이 들어간 모든 열의 isDeleted를
    // // couponState.canceled 로 변경
    // const UserCouponList = await getRepository(UserCoupon).find({
    //   where: {
    //     couponId: result.id
    //   }
    // });
    // const result2 = await UserCouponList.map(x => {
    //   x.isDeleted = couponState.canceled;
    //   return x;
    // });
    // await getRepository(UserCoupon).save(result2);

    // Coupon 테이블에서 해당 쿠폰 isDeleted 를 true로 변경
    const result = await adminModels.couponFindOneId(couponId);
    result.isDeleted = true;
    await adminModels.couponSave(result);

    // UserCoupon 테이블에서 해당쿠폰이 들어간 모든 열의 isDeleted를
    // couponState.canceled 로 변경
    const UserCouponList = await adminModels.userCouponFindCouponId(result.id);
    const couponListForCancel = await UserCouponList.map(x => {
      x.isDeleted = couponState.canceled;
      return x;
    });
    await adminModels.userCouponSave(couponListForCancel);
  }

  async getUserCouponListService(): Promise<object> {
    // const userCouponInfo = await getRepository(UserCoupon).find();

    // const userInfo = await getRepository(User).find({
    //   select: ["id", "name", "email"],
    //   where: userCouponInfo.map(x => {
    //     return {
    //       id: x.userId
    //     };
    //   })
    // });

    // const couponInfo = await getRepository(Coupon).find({
    //   select: ["id", "couponName", "couponCode"],
    //   where: userCouponInfo.map(x => {
    //     return {
    //       id: x.couponId
    //     };
    //   })
    // });
    // /////////////////////

    // const result = userCouponInfo.map(x => {
    //   const filteredUserInfo = userInfo.filter(y => {
    //     return y.id === x.userId;
    //   });
    //   const filteredCouponInfo = couponInfo.filter(y => {
    //     return y.id === x.couponId;
    //   });

    //   const time = new Date(x.createdAt.toString());
    //   const timeData = getTime(time);

    //   return {
    //     userName: filteredUserInfo[0].name,
    //     userEmail: filteredUserInfo[0].email,
    //     couponName: filteredCouponInfo[0].couponName,
    //     couponCode: filteredCouponInfo[0].couponCode,
    //     assignedAt: timeData,
    //     expiredAt: x.expiredAt,
    //     isDeletedAt: x.isDeleted
    //   };
    // });
    // return { key: result };

    const userCouponInfo = await adminModels.userCouponFindAll();

    const userInfo = await adminModels.userFindFilter(userCouponInfo);

    const couponInfo = await adminModels.couponFindFilter(userCouponInfo);
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
