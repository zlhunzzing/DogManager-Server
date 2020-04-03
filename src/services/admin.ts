import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { COUPON_STATE } from "../common/enum";
import { EventData, CouponData, SigninData } from "../common/interface";
import { ERROR_MESSAGE } from "../common/ErrorMessages";
import moment from "moment";
import {
  AdminModels,
  CouponModels,
  EventsModels,
  UserModels,
  UserCouponModels,
  RoomModels
} from "../models";

dotenv.config();
const adminModels = new AdminModels();
const couponModels = new CouponModels();
const eventsModels = new EventsModels();
const userModels = new UserModels();
const userCouponModels = new UserCouponModels();
const roomModels = new RoomModels();

export default class AdminService {
  async addEventService(eventData: EventData): Promise<void> {
    const event = await eventsModels.findOneWithEventUrl(
      eventData.detailPageUrl
    );
    if (event) {
      if (event.detailPageUrl === eventData.detailPageUrl) {
        throw new Error(ERROR_MESSAGE.OVERLAP_DETAIL_PAGE_URL);
      }
    }

    await eventsModels.save(eventData);
  }

  async putEventService(eventData: EventData, eventId: string): Promise<void> {
    const result = await eventsModels.findOneWithEventId(eventId);

    if (result.detailPageUrl !== eventData.detailPageUrl) {
      const event = await eventsModels.findOneWithEventUrl(
        eventData.detailPageUrl
      );
      if (event) {
        if (event.detailPageUrl === eventData.detailPageUrl) {
          throw new Error(ERROR_MESSAGE.OVERLAP_DETAIL_PAGE_URL);
        }
      }
    }
    const updatedEvent = {
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
    await eventsModels.save(updatedEvent);
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
      couponName: couponInfo.couponName,
      couponList: couponListInfo ? couponListInfo : null
    };
    return result;
  }

  async deleteEventService(eventId: string): Promise<void> {
    const result = await eventsModels.findOneWithEventId(eventId);
    result.isDeleted = true;
    await eventsModels.save(result);
  }

  async signinService(adminInfo: SigninData): Promise<object> {
    const { email, password } = adminInfo;

    const result = await adminModels.findOneAccount(email, password);

    if (result) {
      const token = jwt.sign(
        {
          id: result.id,
          email,
          isUser: false
        },
        process.env.JWT_ADMIN_SECRET_KEY,
        {
          expiresIn: "1h"
        }
      );
      return { token };
    } else {
      throw new Error(ERROR_MESSAGE.WRONG_USER_INFO);
    }
  }

  async createCouponService(couponData: CouponData): Promise<void> {
    const result = await couponModels.findOneWithCouponName(
      couponData.couponName
    );
    if (result) {
      throw new Error(ERROR_MESSAGE.OVERLAP_COUPON_NAME);
    }

    const result2 = await couponModels.findOneWithCouponCode(
      couponData.couponCode
    );
    if (result2) {
      throw new Error(ERROR_MESSAGE.OVERLAP_COUPON_CODE);
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
      x.couponState = COUPON_STATE.CANCELED;
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

      const m = moment(new Date(x.createdAt));
      const timeData = m.format("YYYYMMDDHHmm");

      return {
        userName: filteredUserInfo[0].name,
        userEmail: filteredUserInfo[0].email,
        couponName: filteredCouponInfo[0].couponName,
        couponCode: filteredCouponInfo[0].couponCode,
        assignedAt: timeData,
        expiredAt: x.expiredAt,
        couponState: x.couponState
      };
    });
    return { couponList: result };
  }

  async getRoomListService(): Promise<object> {
    const roomList = await roomModels.findAll();
    const userIdList = [];
    for (let i = 0; i < roomList.length; i++) {
      userIdList.push(roomList[i].userId);
    }
    const userInfoList = await userModels.findAllWithUserId(userIdList);
    for (let i = 0; i < userInfoList.length; i++) {
      userInfoList[i]["adminCheck"] = roomList[i].adminCheck;
    }
    return { roomList: userInfoList };
  }
}
