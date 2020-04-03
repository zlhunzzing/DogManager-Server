import dotenv from "dotenv";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import moment from "moment";
import { ERROR_MESSAGE } from "../common/ErrorMessages";
import { COUPON_STATE } from "../common/enum";
import { SigninData, SignupData, CouponData } from "../common/interface";
import {
  CommentModels,
  CouponModels,
  EventsModels,
  UserModels,
  UserCouponModels,
  UserThumbsModels
} from "../models";

dotenv.config();
const commentModels = new CommentModels();
const couponModels = new CouponModels();
const eventsModels = new EventsModels();
const userModels = new UserModels();
const userCouponModels = new UserCouponModels();
const userThumbsModels = new UserThumbsModels();

const makeCommentList = async (eventUrl, commentId) => {
  let eventInfo;
  if (eventUrl === null) {
    const commentEvent = await commentModels.findOneWithCommentId(commentId);
    eventInfo = await eventsModels.findOneWithEventId(commentEvent.eventId);
  } else {
    eventInfo = await eventsModels.findOneWithEventUrl(`/${eventUrl}`);
  }

  const commentInfo = await commentModels.findWithEventId(eventInfo.id);
  const userInfo = await userModels.findWithCommentInfoList(commentInfo);
  const commentListInfo = commentInfo.map(x => {
    const filteredUserInfo = userInfo.filter(y => {
      return y.id === x.userId;
    });
    const m = moment(new Date(x.createdAt));
    const timeData = m.format("YYYYMMDDHHmm");
    return {
      id: x.id,
      content: x.content,
      userId: filteredUserInfo[0].id,
      thumb: x.thumb,
      isDeleted: x.isDeleted,
      createdAt: timeData,
      userName: filteredUserInfo[0].name
    };
  });
  await commentListInfo.reverse();
  return commentListInfo;
};

const makeUserThumbsList = async (eventUrl, commentId, userInfo) => {
  if (eventUrl === null) {
    const commentInfo = await commentModels.findOneWithCommentId(commentId);
    const eventInfo = await eventsModels.findOneWithEventId(
      commentInfo.eventId
    );
    eventUrl = eventInfo.detailPageUrl.substring(
      1,
      eventInfo.detailPageUrl.length
    );
  }
  const event = await eventsModels.findOneWithEventUrl(`/${eventUrl}`);
  const commentList = await commentModels.findWithEventId(event.id);
  const commentIdList = await userThumbsModels.findWithIdAndList(
    userInfo.id,
    commentList
  );
  const commentIdArr = [];
  for (let i = 0; i < commentIdList.length; i++) {
    commentIdArr.push(commentIdList[i].commentId);
  }
  return commentIdArr;
};

export default class UserService {
  async getEventListService(): Promise<object> {
    const result = await eventsModels.findAll();
    return { eventList: result };
  }

  async getEventEntryService(eventUrl: string): Promise<object> {
    const eventInfo = await eventsModels.findOneWithEventUrl(`/${eventUrl}`);

    const couponInfo = await couponModels.findOneWithCouponCode(
      eventInfo.couponCode ? eventInfo.couponCode : null
    );

    const commentListInfo = await makeCommentList(eventUrl, null);

    const result = {
      ...eventInfo,
      period: couponInfo ? couponInfo.period : null,
      commentList: commentListInfo
    };
    return result;
  }

  async signupService(userInfo: SignupData): Promise<void> {
    const result = await userModels.findOneWithEmail(userInfo.email);
    if (result) {
      throw new Error(ERROR_MESSAGE.OVERLAP_USER_EMAIL);
    }
    const shasum = crypto.createHmac("sha512", process.env.CRYPTO_SECRET_KEY);
    shasum.update(userInfo.password);
    userInfo.password = shasum.digest("hex");

    await userModels.save(userInfo);
  }

  async signinService(userInfo: SigninData): Promise<object> {
    const shasum = crypto.createHmac("sha512", process.env.CRYPTO_SECRET_KEY);
    shasum.update(userInfo.password);
    userInfo.password = shasum.digest("hex");
    const result = await userModels.findOneAccount(
      userInfo.email,
      userInfo.password
    );
    if (result) {
      const token = jwt.sign(
        {
          id: result.id,
          email: result.email,
          isUser: true
        },
        process.env.JWT_USER_SECRET_KEY,
        {
          expiresIn: "1h"
        }
      );
      return { token, userId: result.id };
    } else {
      throw new Error(ERROR_MESSAGE.WRONG_USER_INFO);
    }
  }

  async getCouponListService(tokenInfo): Promise<object> {
    const userInfo = await userModels.findOneWithUserId(tokenInfo.id);
    const userCouponInfo = await userCouponModels.findWithUserId(userInfo.id);

    const m = moment(new Date());
    const recentTime = m.format("YYYYMMDDHHmm");

    const filteredUserCouponInfo = [];
    await userCouponInfo.forEach(async x => {
      if (Number(x.expiredAt) > Number(recentTime)) {
        filteredUserCouponInfo.push(x);
      } else {
        x.couponState = COUPON_STATE.CANCELED;
        await userCouponModels.save(x);
      }
    });
    const couponInfo = await couponModels.findWithCouponInfoList(
      filteredUserCouponInfo
    );
    const result = [];
    for (let i = 0; i < filteredUserCouponInfo.length; i++) {
      result.push({
        couponName: couponInfo[i].couponName,
        description: couponInfo[i].description,
        expiredAt: filteredUserCouponInfo[i].expiredAt
      });
    }
    return result;
  }

  async addCouponService(couponData: CouponData, tokenInfo): Promise<void> {
    const coupon = await couponModels.findOneWithCouponCode(
      couponData.couponCode
    );
    // // 조회한 쿠폰을 이미 가지고 있을 경우 중복처리
    const userCoupon = await userCouponModels.findOneWithId(
      tokenInfo.id,
      coupon.id
    );
    if (userCoupon) {
      throw new Error(ERROR_MESSAGE.OVERLAP_COUPON);
    }
    // 쿠폰을 생성
    const newCouponData = {
      couponId: coupon.id,
      userId: tokenInfo.id,
      expiredAt: couponData.expiredAt
    };
    await userCouponModels.save(newCouponData);
  }

  async deleteCommentService(commentId): Promise<object> {
    const comment = await commentModels.findOneWithCommentId(commentId);
    comment.isDeleted = true;
    await userThumbsModels.delete({ commentId });
    await commentModels.save(comment);

    const commentListInfo = await makeCommentList(null, commentId);

    return { commentList: commentListInfo };
  }

  async updateCommentService(
    commentData,
    commentId,
    tokenInfo
  ): Promise<object> {
    const comment = await commentModels.findOneWithCommentId(commentId);
    comment.content = commentData.content;
    await commentModels.save(comment);

    const commentIdArr = await makeUserThumbsList(null, commentId, tokenInfo);
    const commentListInfo = await makeCommentList(null, commentId);

    return { userThumbsList: commentIdArr, commentList: commentListInfo };
  }

  async addCommentService(commentData, tokenInfo): Promise<object> {
    const forInsertData = {
      ...commentData,
      userId: tokenInfo.id
    };
    await commentModels.save(forInsertData);

    const eventInfo = await eventsModels.findOneWithEventId(
      commentData.eventId
    );
    const commentListInfo = await makeCommentList(
      eventInfo.detailPageUrl.substring(1, eventInfo.detailPageUrl.length),
      null
    );

    return { commentList: commentListInfo };
  }

  async addThumbService(commentId, tokenInfo): Promise<object> {
    const comment = await commentModels.findOneWithCommentId(commentId);
    comment.thumb++;
    await commentModels.save(comment);

    const thumbData = {
      userId: tokenInfo.id,
      commentId
    };
    await userThumbsModels.save(thumbData);
    const commentIdArr = await makeUserThumbsList(null, commentId, tokenInfo);
    const commentListInfo = await makeCommentList(null, commentId);

    return { userThumbsList: commentIdArr, commentList: commentListInfo };
  }

  async removeThumbService(commentId, tokenInfo): Promise<object> {
    const comment = await commentModels.findOneWithCommentId(commentId);
    comment.thumb--;
    await commentModels.save(comment);
    await userThumbsModels.delete({
      userId: tokenInfo.id,
      commentId: Number(commentId)
    });

    const commentIdArr = await makeUserThumbsList(null, commentId, tokenInfo);
    const commentListInfo = await makeCommentList(null, commentId);

    return { userThumbsList: commentIdArr, commentList: commentListInfo };
  }

  async getUserThumbsListService(eventUrl, tokenInfo): Promise<object> {
    const commentIdArr = await makeUserThumbsList(eventUrl, null, tokenInfo);
    return { userThumbsList: commentIdArr };
  }
}
