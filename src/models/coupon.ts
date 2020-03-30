import { Coupon } from "../database/entity/Coupon";
import { getRepository } from "typeorm";

export default class CouponModels {
  async find(couponInfo) {
    let options = [{ isDeleted: false }];
    if (couponInfo) {
      options = couponInfo.map(x => {
        return { id: x.couponId, isDeleted: false };
      });
    }
    return await getRepository(Coupon).find({
      where: options
    });
  }
  async findOne(couponId, couponName, couponCode) {
    const options = [];
    if (couponId) options.push({ id: couponId });
    if (couponName) options.push({ couponName });
    if (couponCode) options.push({ couponCode });
    return await getRepository(Coupon).findOne({
      where: options
    });
  }

  async save(couponData) {
    await getRepository(Coupon).save(couponData);
  }
  async findFilter(userCouponInfo) {
    return await getRepository(Coupon).find({
      select: ["id", "couponName", "couponCode"],
      where: userCouponInfo.map(x => {
        return {
          id: x.couponId
        };
      })
    });
  }
}
