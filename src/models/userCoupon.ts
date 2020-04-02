import { UserCoupon } from "../database/entity/UserCoupon";
import { getRepository } from "typeorm";

import { COUPON_STATE } from "../common/enum";

export default class UserCouponModels {
  async findAll() {
    return await getRepository(UserCoupon).find({
      where: {
        couponState: COUPON_STATE.ENABLE.toString()
      }
    });
  }

  async findWithUserId(userId) {
    return await getRepository(UserCoupon).find({
      where: {
        couponState: COUPON_STATE.ENABLE.toString(),
        userId
      }
    });
  }

  async findWithCouponId(couponId) {
    return await getRepository(UserCoupon).find({
      where: {
        couponId,
        couponState: COUPON_STATE.ENABLE.toString()
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
