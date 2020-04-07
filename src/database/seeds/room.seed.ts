import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { Room } from "../entity/Room";

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const roomData = [
      {
        userId: 1,
        adminCheck: true,
      },
      {
        userId: 2,
        adminCheck: true,
      },
      {
        userId: 4,
        adminCheck: false,
      },
    ];
    await connection.getRepository(Room).save(roomData);
  }
}
