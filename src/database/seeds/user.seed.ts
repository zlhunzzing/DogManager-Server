import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";
import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { User } from "../../entity/User";

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const shasum = crypto.createHmac("sha512", process.env.CRYPTO_SECRET_KEY);
    shasum.update("1234");

    const userData = {
      email: "kirca322@naver.com",
      password: shasum.digest("hex"),
      address: "cheon-an",
      mobile: "010-0000-0000",
      name: "tae sun"
    };
    await connection.getRepository(User).save(userData);
  }
}
