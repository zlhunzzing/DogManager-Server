import { User } from "../database/entity/User";
import { getRepository } from "typeorm";

export default class UserModels {
  async findWithCommentInfoList(commentInfo) {
    return await getRepository(User).find({
      where: commentInfo.map(x => {
        return {
          id: x.userId
        };
      })
    });
  }

  async findAllWithUserId(userIdList) {
    return await getRepository(User).find({
      select: ["id", "name"],
      where: userIdList.map(userId => {
        return {
          id: userId
        };
      })
    });
  }

  async findOneWithUserId(userId) {
    return await getRepository(User).findOne({
      where: {
        id: userId
      }
    });
  }

  async findOneWithEmail(email) {
    return await getRepository(User).findOne({
      where: {
        email
      }
    });
  }

  async findOneAccount(email, password) {
    return await getRepository(User).findOne({
      where: {
        email,
        password
      }
    });
  }

  async save(userData) {
    await getRepository(User).save(userData);
  }

  async findFilter(userCouponInfo) {
    return await getRepository(User).find({
      select: ["id", "name", "email"],
      where: userCouponInfo.map(x => {
        return {
          id: x.userId
        };
      })
    });
  }
}
