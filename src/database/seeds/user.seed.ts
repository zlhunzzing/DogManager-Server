import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";
import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { User } from "../entity/User";

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const shasum = crypto.createHmac("sha512", process.env.CRYPTO_SECRET_KEY);
    shasum.update("1234");
    const hashedPassword = shasum.digest("hex");

    const userData = [
      {
        email: "kirca322@naver.com",
        password: hashedPassword,
        address: "cheon-an",
        mobile: "010-0000-0000",
        name: "tae sun"
      },
      {
        email: "kim1@naver.com",
        password: hashedPassword,
        address: "cheon-an",
        mobile: "010-0000-0000",
        name: "kim1"
      },
      {
        email: "kim2@naver.com",
        password: hashedPassword,
        address: "cheon-an",
        mobile: "010-0000-0000",
        name: "kim2"
      },
      {
        email: "kim3@naver.com",
        password: hashedPassword,
        address: "cheon-an",
        mobile: "010-0000-0000",
        name: "kim3"
      }
    ];
    await connection.getRepository(User).save(userData);
  }
}
