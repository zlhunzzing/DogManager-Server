import { Room } from "../database/entity/Room";
import { getRepository } from "typeorm";

export default class RoomModels {
  async findOneWithUserId(userId) {
    return await getRepository(Room).findOne({
      where: {
        userId
      }
    });
  }

  async findAll() {
    return await getRepository(Room).find();
  }

  async save(roomData) {
    await getRepository(Room).save(roomData);
  }
}
