import { Room } from "../database/entity/Room";
import { getRepository } from "typeorm";

export default class RoomModels {
  async findOne(userId) {
    return await getRepository(Room).findOne({
      where: {
        userId
      }
    });
  }

  async save(roomData) {
    await getRepository(Room).save(roomData);
  }
}
