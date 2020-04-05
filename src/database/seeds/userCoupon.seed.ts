import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { UserCoupon } from "../entity/UserCoupon";

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const userCouponData = [
      {
        couponId: 1,
        userId: 1,
        expiredAt: "202005042047",
      },
      {
        couponId: 2,
        userId: 1,
        expiredAt: "202005042047",
      },
      {
        couponId: 2,
        userId: 2,
        expiredAt: "202005042047",
      },
      {
        couponId: 1,
        userId: 3,
        expiredAt: "202005042047",
      },
      {
        couponId: 1,
        userId: 4,
        expiredAt: "202005042047",
      },
      {
        couponId: 2,
        userId: 4,
        expiredAt: "202005042047",
      },
    ];
    await connection.getRepository(UserCoupon).save(userCouponData);
  }
}
