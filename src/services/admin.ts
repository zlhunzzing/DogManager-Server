import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import {
  AdminModels,
  CouponModels,
  EventsModels,
  UserModels,
  UserCouponModels,
  RoomModels
} from "../models";

const adminModels = new AdminModels();
const couponModels = new CouponModels();
const eventsModels = new EventsModels();
const userModels = new UserModels();
const userCouponModels = new UserCouponModels();
const roomModels = new RoomModels();

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
    const inData = await eventsModels.findOneWithEventUrl(
      eventData.detailPageUrl
    );
    if (inData) {
      if (inData.detailPageUrl === eventData.detailPageUrl) {
        return { key: "detailPageUrl" };
      }
    }

    const forInsertData = {
      ...eventData,
      detailPageUrl: eventData.detailPageUrl ? eventData.detailPageUrl : null,
      couponCode: eventData.couponCode ? eventData.couponCode : null
    };
    await eventsModels.save(forInsertData);
    return { key: "completed" };
  }

  async putEventService(
    eventData: EventData,
    eventId: string
  ): Promise<object> {
    const result = await eventsModels.findOneWithEventId(eventId);

    if (result.detailPageUrl !== eventData.detailPageUrl) {
      const inData = await eventsModels.findOneWithEventUrl(
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
    await eventsModels.save(updatedResult);
    return { key: "completed" };
  }

  async getEventListService(): Promise<object> {
    const result = await eventsModels.findAll();
    return result;
  }

  async getEventEntryService(eventId: string): Promise<object> {
    const eventInfo = await eventsModels.findOneWithEventId(eventId);
    const couponInfo = await couponModels.findOneWithCouponCode(
      eventInfo.couponCode
    );
    const couponListInfo = await couponModels.findAll();
    const result = {
      ...eventInfo,
      couponName: couponInfo ? couponInfo.couponName : null,
      couponList: couponListInfo ? couponListInfo : null
    };
    return result;
  }

  async deleteEventService(eventId: string): Promise<void> {
    const result = await eventsModels.findOneWithEventId(eventId);
    result.isDeleted = true;
    await eventsModels.save(result);
  }

  async signinService(adminInfo: EventData): Promise<object> {
    const { email, password } = adminInfo;

    const result = await adminModels.findOneAccount(email, password);

    if (result) {
      const token = jwt.sign(
        {
          id: result.id,
          email,
          isUser: false
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
    const result = await couponModels.findOneWithCouponName(
      couponData.couponName
    );
    if (result) {
      return { key: "couponName already exist" };
    }

    const result2 = await couponModels.findOneWithCouponCode(
      couponData.couponCode
    );
    if (result2) {
      return { key: "couponCode already exist" };
    }
    await couponModels.save(couponData);
  }

  async getCouponListService(): Promise<object> {
    const couponList = await couponModels.findAll();
    return couponList;
  }

  async deleteCouponService(couponId): Promise<void> {
    // Coupon 테이블에서 해당 쿠폰 isDeleted 를 true로 변경
    const result = await couponModels.findOneWithCouponId(couponId);
    result.isDeleted = true;
    await couponModels.save(result);

    // UserCoupon 테이블에서 해당쿠폰이 들어간 모든 열의 isDeleted를
    // couponState.canceled 로 변경
    const UserCouponList = await userCouponModels.findWithCouponId(result.id);
    const couponListForCancel = await UserCouponList.map(x => {
      x.isDeleted = couponState.canceled;
      return x;
    });
    await userCouponModels.save(couponListForCancel);
  }

  async getUserCouponListService(): Promise<object> {
    const userCouponInfo = await userCouponModels.findAll();

    const userInfo = await userModels.findFilter(userCouponInfo);

    const couponInfo = await couponModels.findFilter(userCouponInfo);

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
        isDeleted: x.isDeleted
      };
    });
    return { key: result };
  }

  async getRoomListService(): Promise<object> {
    const roomList = await roomModels.findAll();
    const userIdList = [];
    for (let i = 0; i < roomList.length; i++) {
      userIdList.push(roomList[i].userId);
    }
    const userInfoList = await userModels.findAllWithUserId(userIdList);
    return { roomList: userInfoList };
  }
}
