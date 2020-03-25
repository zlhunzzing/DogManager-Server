import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { Coupon } from "../../entity/Coupon";

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const couponData = [
      {
        couponName: "first coupon",
        couponCode: "@first",
        description: "this is first coupon",
        period: 7,
        discount: "10%"
      },
      {
        couponName: "second coupon",
        couponCode: "@second",
        description: "this is second coupon",
        period: 7,
        discount: "20%"
      }
    ];
    await connection.getRepository(Coupon).save(couponData);
  }
}
