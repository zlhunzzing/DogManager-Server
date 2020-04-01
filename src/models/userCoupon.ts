import { UserCoupon } from "../database/entity/UserCoupon";
import { getRepository } from "typeorm";

enum couponState {
  enable,
  disable,
  canceled
}

export default class UserCouponModels {
  async findAll() {
    return await getRepository(UserCoupon).find({
      where: {
        isDeleted: couponState.enable
      }
    });
  }

  async findWithUserId(userId) {
    return await getRepository(UserCoupon).find({
      where: {
        isDeleted: couponState.enable,
        userId
      }
    });
  }

  async findWithCouponId(couponId) {
    return await getRepository(UserCoupon).find({
      where: {
        couponId,
        isDeleted: couponState.enable
      }
    });
  }

  async findOneWithId(userId, couponId) {
    return await getRepository(UserCoupon).findOne({
      where: {
        userId,
        couponId
      }
    });
  }

  async save(data) {
    await getRepository(UserCoupon).save(data);
  }
}
