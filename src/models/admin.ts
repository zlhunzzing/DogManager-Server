import { Admin } from "../database/entity/Admin";
import { getRepository } from "typeorm";

export default class AdminModels {
  async findOneAccount(email, password) {
    return await getRepository(Admin).findOne({
      where: {
        email,
        password
      }
    });
  }
}
