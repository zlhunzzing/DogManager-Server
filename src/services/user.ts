import dotenv from "dotenv";
dotenv.config();
import { getRepository, getConnection } from "typeorm";
import { Events } from "../database/entity/Events";
import { User } from "../database/entity/User";
import { Coupon } from "../database/entity/Coupon";
import { Comment } from "../database/entity/Comment";
import { UserCoupon } from "../database/entity/UserCoupon";
import { UserThumbs } from "../database/entity/UserThumbs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

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
    const commentEvent = await getRepository(Comment).findOne({
      select: ["eventId"],
      where: {
        id: commentId
      }
    });

    eventInfo = await getRepository(Events).findOne({
      where: {
        id: commentEvent.eventId,
        isDeleted: false
      }
    });
  } else {
    eventInfo = await getRepository(Events).findOne({
      where: {
        detailPageUrl: `/${eventUrl}`,
        isDeleted: false
      }
    });
  }

  const commentInfo = await getRepository(Comment).find({
    select: ["id", "userId", "content", "createdAt", "thumb", "isDeleted"],
    where: {
      eventId: eventInfo.id,
      isDeleted: false
    }
  });
  const userInfo = await getRepository(User).find({
    select: ["id", "name"],
    where: commentInfo.map(x => {
      return {
        id: x.userId
      };
    })
  });
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
    const commentInfo = await getRepository(Comment).findOne({
      where: {
        id: commentId
      }
    });
    const eventInfo = await getRepository(Events).findOne({
      where: {
        id: commentInfo.eventId
      }
    });
    eventUrl = eventInfo.detailPageUrl.substring(
      1,
      eventInfo.detailPageUrl.length
    );
  }
  const event = await getRepository(Events).findOne({
    where: {
      detailPageUrl: `/${eventUrl}`
    }
  });
  const commentList = await getRepository(Comment).find({
    where: {
      eventId: event.id
    }
  });
  const commentIdList = await getRepository(UserThumbs).find({
    select: ["commentId"],
    where: commentList.map(x => {
      return {
        commentId: x.id,
        userId: userInfo.id
      };
    })
  });
  const commentIdArr = [];
  for (let i = 0; i < commentIdList.length; i++) {
    commentIdArr.push(commentIdList[i].commentId);
  }
  return commentIdArr;
};

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

  async getEventEntryService(eventUrl: string): Promise<object> {
    const eventInfo = await getRepository(Events).findOne({
      where: {
        detailPageUrl: `/${eventUrl}`,
        isDeleted: false
      }
    });

    const couponInfo = await getRepository(Coupon).findOne({
      where: {
        couponCode: eventInfo.couponCode ? eventInfo.couponCode : null
      }
    });

    const commentListInfo = await makeCommentList(eventUrl, null);

    const result = {
      ...eventInfo,
      period: couponInfo ? couponInfo.period : null,
      commentList: commentListInfo
    };
    return result;
  }

  async signupService(userInfo: SignupData): Promise<object> {
    const result = await getRepository(User).findOne({
      where: {
        email: userInfo.email
      }
    });
    if (result) {
      return { key: "already exist" };
    }
    const shasum = crypto.createHmac("sha512", process.env.CRYPTO_SECRET_KEY);
    shasum.update(userInfo.password);
    userInfo.password = shasum.digest("hex");
    const user = new User();
    const forInsertData = {
      ...user,
      ...userInfo
    };
    await getRepository(User).save(forInsertData);
    return { key: "completed" };
  }

  async signinService(userInfo: SigninData): Promise<object> {
    const shasum = crypto.createHmac("sha512", process.env.CRYPTO_SECRET_KEY);
    shasum.update(userInfo.password);
    userInfo.password = shasum.digest("hex");
    const result = await getRepository(User).findOne({
      where: {
        email: userInfo.email,
        password: userInfo.password
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
      return { key: token, id: result.id };
    } else {
      return { key: "unvalid user" };
    }
  }

  async getCouponListService(tokenInfo): Promise<object> {
    const userInfo = await getRepository(User).findOne({
      where: {
        id: tokenInfo.id
      }
    });
    const userCouponInfo = await getRepository(UserCoupon).find({
      where: {
        userId: userInfo.id,
        isDeleted: couponState.enable
      }
    });
    const recentTime = getRecentTime();
    const filteredUserCouponInfo = [];
    await userCouponInfo.forEach(async x => {
      if (Number(x.expiredAt) > Number(recentTime)) {
        filteredUserCouponInfo.push(x);
      } else {
        x.isDeleted = couponState.canceled;
        await getRepository(UserCoupon).save(x);
      }
    });
    const couponInfo = await getRepository(Coupon).find({
      where: filteredUserCouponInfo.map(x => {
        return { id: x.couponId };
      })
    });
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
    // // 해당 이벤트의 쿠폰정보를 조회
    const coupon = await getRepository(Coupon).findOne({
      where: {
        couponCode: couponData.couponCode
      }
    });
    // // 조회한 쿠폰을 이미 가지고 있을 경우 중복처리
    const inData = await getRepository(UserCoupon).findOne({
      where: {
        userId: tokenInfo.id,
        couponId: coupon.id
      }
    });
    if (inData) {
      return { key: "duplicate" };
    }
    // 쿠폰을 생성
    const forInsertData = {
      couponId: coupon.id,
      userId: tokenInfo.id,
      expiredAt: couponData.expiredAt
    };
    await getRepository(UserCoupon).save(forInsertData);
    return { key: "success" };
  }

  async deleteCommentService(commentId): Promise<object> {
    const comment = await getRepository(Comment).findOne({
      where: {
        id: commentId
      }
    });
    comment.isDeleted = true;
    await getRepository(UserThumbs).delete({ commentId });
    await getRepository(Comment).save(comment);

    const commentListInfo = await makeCommentList(null, commentId);

    return { commentList: commentListInfo };
  }

  async updateCommentService(
    commentData,
    commentId,
    tokenInfo
  ): Promise<object> {
    const comment = await getRepository(Comment).findOne({
      where: {
        id: commentId
      }
    });
    comment.content = commentData.content;
    await getRepository(Comment).save(comment);

    const commentIdArr = await makeUserThumbsList(null, commentId, tokenInfo);
    const commentListInfo = await makeCommentList(null, commentId);

    return { userThumbsList: commentIdArr, commentList: commentListInfo };
  }

  async addCommentService(commentData, tokenInfo): Promise<object> {
    const forInsertData = {
      ...commentData,
      userId: tokenInfo.id
    };
    await getRepository(Comment).save(forInsertData);

    const eventInfo = await getRepository(Events).findOne({
      where: {
        id: commentData.eventId,
        isDeleted: false
      }
    });
    const commentListInfo = await makeCommentList(
      eventInfo.detailPageUrl.substring(1, eventInfo.detailPageUrl.length),
      null
    );

    return { commentList: commentListInfo };
  }

  async addThumbService(commentId, tokenInfo): Promise<object> {
    const comment = await getRepository(Comment).findOne({
      where: {
        id: commentId
      }
    });
    comment.thumb++;
    await getRepository(Comment).save(comment);

    const forInsertData = {
      userId: tokenInfo.id,
      commentId
    };
    await getRepository(UserThumbs).save(forInsertData);
    const commentIdArr = await makeUserThumbsList(null, commentId, tokenInfo);
    const commentListInfo = await makeCommentList(null, commentId);

    return { userThumbsList: commentIdArr, commentList: commentListInfo };
  }

  async removeThumbService(commentId, tokenInfo): Promise<object> {
    const comment = await getRepository(Comment).findOne({
      where: {
        id: commentId
      }
    });
    comment.thumb--;
    await getRepository(Comment).save(comment);
    await getRepository(UserThumbs).delete({
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
