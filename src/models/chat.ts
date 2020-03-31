import { Chat } from "../database/entity/Chat";
import { getRepository } from "typeorm";

export default class ChatModels {
  async find(roomId) {
    return await getRepository(Chat).find({
      select: ["content", "createdAt", "writer"],
      where: {
        roomId
      }
    });
  }

  async save(chatData) {
    await getRepository(Chat).save(chatData);
  }
}
