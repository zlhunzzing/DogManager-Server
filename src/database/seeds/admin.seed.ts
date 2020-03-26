import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { Admin } from "../entity/Admin";

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const adminData = {
      email: "admin@dogmate.com",
      password: "1234"
    };
    await connection.getRepository(Admin).save(adminData);
  }
}
