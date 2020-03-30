import { UserCoupon } from "../database/entity/UserCoupon";
import { getRepository } from "typeorm";

export default class UserCouponModels {
  async find(userId, couponId, isDeleted) {
    const options = { isDeleted: false };
    if (userId) options["userId"] = userId;
    if (couponId) options["couponId"] = couponId;
    if (isDeleted) options["isDeleted"] = isDeleted;
    return await getRepository(UserCoupon).find({
      where: options
    });
  }

  async findOne(userId, couponId) {
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
