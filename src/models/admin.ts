import { getRepository } from "typeorm";
import { Events } from "../database/entity/Events";
import { Admin } from "../database/entity/Admin";
import { Coupon } from "../database/entity/Coupon";
import { UserCoupon } from "../database/entity/UserCoupon";
import { User } from "../database/entity/User";

export default class AdminModels {
  async eventFindOneDetailPage(eventUrl) {
    return await getRepository(Events).findOne({
      where: {
        detailPageUrl: eventUrl
      }
    });
  }

  async eventSave(eventData) {
    await getRepository(Events).save(eventData);
  }

  async eventFindOneId(eventId) {
    return await getRepository(Events).findOne({
      where: {
        id: eventId,
        isDeleted: false
      }
    });
  }

  async eventFind() {
    return await getRepository(Events).find({
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
  }

  async couponFindOneCouponCode(couponCode) {
    return await getRepository(Coupon).findOne({
      where: {
        couponCode
      }
    });
  }

  async couponFindAll() {
    return await getRepository(Coupon).find({
      where: {
        isDeleted: false
      }
    });
  }

  async adminFindOneAccount(email, password) {
    return await getRepository(Admin).findOne({
      where: {
        email,
        password
      }
    });
  }

  async couponFindOneNameOrCode(couponName, couponCode) {
    return await getRepository(Coupon).findOne({
      where: [
        {
          couponName
        },
        {
          couponCode
        }
      ]
    });
  }

  async couponSave(couponData) {
    await getRepository(Coupon).save(couponData);
  }

  async couponFindOneId(couponId) {
    return await getRepository(Coupon).findOne({
      where: {
        id: couponId
      }
    });
  }

  async userCouponFindCouponId(couponId) {
    return await getRepository(UserCoupon).find({
      where: {
        couponId
      }
    });
  }

  async userCouponSave(couponList) {
    await getRepository(UserCoupon).save(couponList);
  }

  async userCouponFindAll() {
    return await getRepository(UserCoupon).find();
  }

  async userFindFilter(userCouponInfo) {
    return await getRepository(User).find({
      select: ["id", "name", "email"],
      where: userCouponInfo.map(x => {
        return {
          id: x.userId
        };
      })
    });
  }

  async couponFindFilter(userCouponInfo) {
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
