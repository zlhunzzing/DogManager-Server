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
        email: "user1@dogmate.com",
        password: hashedPassword,
        address: "non",
        mobile: "010-0000-0000",
        name: "김태선",
      },
      {
        email: "user2@dogmate.com",
        password: hashedPassword,
        address: "non",
        mobile: "010-0000-0000",
        name: "김지훈",
      },
      {
        email: "user3@dogmate.com",
        password: hashedPassword,
        address: "non",
        mobile: "010-0000-0000",
        name: "윤민아",
      },
      {
        email: "user4@dogmate.com",
        password: hashedPassword,
        address: "non",
        mobile: "010-0000-0000",
        name: "정의영",
      },
    ];
    await connection.getRepository(User).save(userData);
  }
}
