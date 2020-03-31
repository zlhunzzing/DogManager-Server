import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";
import jwt from "jsonwebtoken";

import {
  CommentModels,
  CouponModels,
  EventsModels,
  UserModels,
  UserCouponModels,
  UserThumbsModels
} from "../models";

const commentModels = new CommentModels();
const couponModels = new CouponModels();
const eventsModels = new EventsModels();
const userModels = new UserModels();
const userCouponModels = new UserCouponModels();
const userThumbsModels = new UserThumbsModels();

enum couponState {
  enable,
  disable,
  canceled
}

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

const getRecentTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  let month = (now.getMonth() + 1).toString();
  month = Number(month) < 10 ? "0" + month : month;
  const date = now.getDate();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const result = "" + year + month + date + hour + minute;
  return result;
};

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

interface CouponData {
  couponName: string;
  couponCode: string;
  description: string;
  period: number;
  discount: string;
  expiredAt: string;
}

const makeCommentList = async (eventUrl, commentId) => {
  let eventInfo;
  if (eventUrl === null) {
    const commentEvent = await commentModels.findOne(commentId);

    eventInfo = await eventsModels.findOne(commentEvent.eventId, null);
  } else {
    eventInfo = await eventsModels.findOne(null, `/${eventUrl}`);
  }

  const commentInfo = await commentModels.find(eventInfo.id);
  const userInfo = await userModels.find(commentInfo);
  const commentListInfo = commentInfo.map(x => {
    const filteredUserInfo = userInfo.filter(y => {
      return y.id === x.userId;
    });
    const time = new Date(x.createdAt.toString());
    const timeData = getTime(time);
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
    const commentInfo = await commentModels.findOne(commentId);
    const eventInfo = await eventsModels.findOne(commentInfo.eventId, null);
    eventUrl = eventInfo.detailPageUrl.substring(
      1,
      eventInfo.detailPageUrl.length
    );
  }
  const event = await eventsModels.findOne(null, `/${eventUrl}`);
  const commentList = await commentModels.find(event.id);
  const commentIdList = await userThumbsModels.find(userInfo.id, commentList);
  const commentIdArr = [];
  for (let i = 0; i < commentIdList.length; i++) {
    commentIdArr.push(commentIdList[i].commentId);
  }
  return commentIdArr;
};

export default class UserService {
  async getEventListService(): Promise<object> {
    const result = await eventsModels.find();
    return result;
  }

  async getEventEntryService(eventUrl: string): Promise<object> {
    const eventInfo = await eventsModels.findOne(null, `/${eventUrl}`);

    const couponInfo = await couponModels.findOne(
      null,
      null,
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

  async signupService(userInfo: SignupData): Promise<object> {
    const result = await userModels.findOne(null, userInfo.email, null);
    if (result) {
      return { key: "already exist" };
    }
    const shasum = crypto.createHmac("sha512", process.env.CRYPTO_SECRET_KEY);
    shasum.update(userInfo.password);
    userInfo.password = shasum.digest("hex");

    await userModels.save(userInfo);
    return { key: "completed" };
  }

  async signinService(userInfo: SigninData): Promise<object> {
    const shasum = crypto.createHmac("sha512", process.env.CRYPTO_SECRET_KEY);
    shasum.update(userInfo.password);
    userInfo.password = shasum.digest("hex");
    const result = await userModels.findOne(
      null,
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
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1h"
        }
      );
      return { key: token, id: result.id };
    } else {
      return { key: "unvalid user" };
    }
  }

  async getCouponListService(tokenInfo): Promise<object> {
    const userInfo = await userModels.findOne(tokenInfo.id, null, null);
    const userCouponInfo = await userCouponModels.find(
      userInfo.id,
      null,
      couponState.enable
    );
    const recentTime = getRecentTime();
    const filteredUserCouponInfo = [];
    await userCouponInfo.forEach(async x => {
      if (Number(x.expiredAt) > Number(recentTime)) {
        filteredUserCouponInfo.push(x);
      } else {
        x.isDeleted = couponState.canceled;
        await userCouponModels.save(x);
      }
    });
    const couponInfo = await couponModels.find(filteredUserCouponInfo);
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

  async addCouponService(couponData: CouponData, tokenInfo): Promise<object> {
    const coupon = await couponModels.findOne(
      null,
      null,
      couponData.couponCode
    );
    // // 조회한 쿠폰을 이미 가지고 있을 경우 중복처리
    const inData = await userCouponModels.findOne(tokenInfo.id, coupon.id);
    if (inData) {
      return { key: "duplicate" };
    }
    // 쿠폰을 생성
    const forInsertData = {
      couponId: coupon.id,
      userId: tokenInfo.id,
      expiredAt: couponData.expiredAt
    };
    await userCouponModels.save(forInsertData);
    return { key: "success" };
  }

  async deleteCommentService(commentId): Promise<object> {
    const comment = await commentModels.findOne(commentId);
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
    const comment = await commentModels.findOne(commentId);
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

    const eventInfo = await eventsModels.findOne(commentData.eventId, null);
    const commentListInfo = await makeCommentList(
      eventInfo.detailPageUrl.substring(1, eventInfo.detailPageUrl.length),
      null
    );

    return { commentList: commentListInfo };
  }

  async addThumbService(commentId, tokenInfo): Promise<object> {
    const comment = await commentModels.findOne(commentId);
    comment.thumb++;
    await commentModels.save(comment);

    const forInsertData = {
      userId: tokenInfo.id,
      commentId
    };
    await userThumbsModels.save(forInsertData);
    const commentIdArr = await makeUserThumbsList(null, commentId, tokenInfo);
    const commentListInfo = await makeCommentList(null, commentId);

    return { userThumbsList: commentIdArr, commentList: commentListInfo };
  }

  async removeThumbService(commentId, tokenInfo): Promise<object> {
    const comment = await commentModels.findOne(commentId);
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
