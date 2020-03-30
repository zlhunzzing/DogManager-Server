import { User } from "../database/entity/User";
import { getRepository } from "typeorm";

export default class UserModels {
  async find(commentInfo) {
    return await getRepository(User).find({
      where: commentInfo.map(x => {
        return {
          id: x.userId
        };
      })
    });
  }

  async findOne(id, email, password) {
    const options = {};
    if (id) options["id"] = id;
    if (email) options["email"] = email;
    if (password) options["passowrd"] = password;
    return await getRepository(User).findOne({
      where: options
    });
  }

  async save(userData) {
    await getRepository(User).save(userData);
  }

  async findFilter(userCouponInfo) {
    return await getRepository(User).find({
      select: ["id", "name", "email"],
      where: userCouponInfo.map(x => {
        return {
          id: x.userId
        };
      })
    });
  }
}
