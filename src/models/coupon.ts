import { Coupon } from "../database/entity/Coupon";
import { getRepository } from "typeorm";
import { COUPON_STATE } from "../common/enum";

export default class CouponModels {
  async findWithCouponInfoList(couponInfo) {
    const options = couponInfo.map(x => {
      return { id: x.couponId, couponState: COUPON_STATE.ENABLE.toString() };
    });

    return await getRepository(Coupon).find({
      where: options
    });
  }

  async findAll() {
    return await getRepository(Coupon).find({
      where: {
        isDeleted: false
      }
    });
  }

  async findOneWithCouponCode(couponCode) {
    return await getRepository(Coupon).findOne({
      where: {
        couponCode
      }
    });
  }

  async findOneWithCouponName(couponName) {
    return await getRepository(Coupon).findOne({
      where: {
        couponName
      }
    });
  }

  async findOneWithCouponId(couponId) {
    return await getRepository(Coupon).findOne({
      where: {
        id: couponId
      }
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
