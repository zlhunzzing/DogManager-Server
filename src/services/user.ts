import { getRepository } from "typeorm";
import { Events } from "../entity/Events";
import { User } from "../entity/User";
import crypto from "crypto";
import jwt from "jsonwebtoken";

interface SignupData {
  name: string;
  email: string;
  password: string;
  mobile: string;
  address: string;
}

interface SigninData {
  email: string;
  password: string;
}

export default class UserService {
  async getEventListService(): Promise<object> {
    const result = await getRepository(Events).find({
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
    return result;
  }

  async getEventEntryService(url: string): Promise<object> {
    const result = await getRepository(Events).findOne({
      where: {
        detailPageUrl: `/${url}`,
        isDeleted: false
      }
    });
    return result;
  }

  async signupService(data: SignupData): Promise<object> {
    const result = await getRepository(User).findOne({
      where: {
        email: data.email
      }
    });
    if (result) {
      return { key: "already exist" };
    }
    const shasum = crypto.createHmac("sha512", "@thisissecretkey");
    shasum.update(data.password);
    data.password = shasum.digest("hex");
    const user = new User();
    const forInsertData = {
      ...user,
      ...data
    };
    await getRepository(User).save(forInsertData);
    return { key: "completed" };
  }

  async signinService(data: SigninData): Promise<object> {
    const shasum = crypto.createHmac("sha512", "@thisissecretkey");
    shasum.update(data.password);
    data.password = shasum.digest("hex");
    const result = await getRepository(User).findOne({
      where: {
        email: data.email,
        password: data.password
      }
    });
    if (result) {
      const token = jwt.sign(
        {
          id: result.id,
          email: result.email,
          name: result.name
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1h"
        }
      );
      return { key: token };
    } else {
      return { key: "unvalid user" };
    }
  }
}
