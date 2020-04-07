import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { Coupon } from "../entity/Coupon";

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const couponData = [
      {
        couponName: "첫이용 50% 할인 쿠폰",
        couponCode: "@dogmate1",
        description: "첫 이용시 50% 할인 이벤트용 쿠폰",
        period: 7,
        discount: "50%",
      },
      {
        couponName: "객실 10% 할인 쿠폰",
        couponCode: "@dogmate2",
        description: "프레이저 플레이스 객실 패키지 10% 할인",
        period: 30,
        discount: "10%",
      },
      {
        couponName: "방문탁묘 오픈기념 쿠폰",
        couponCode: "@dogmate3",
        description: "방문탁묘 오픈기념 7500원 할인 쿠폰",
        period: 14,
        discount: "7500원",
      },
    ];
    await connection.getRepository(Coupon).save(couponData);
  }
}
