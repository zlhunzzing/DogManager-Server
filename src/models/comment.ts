import { Comment } from "../database/entity/Comment";
import { getRepository } from "typeorm";

export default class CommentModels {
  async find(eventId) {
    const options = { isDeleted: false };
    if (eventId) options["eventId"] = eventId;
    return await getRepository(Comment).find({ where: options });
  }

  async findOne(commentId) {
    return await getRepository(Comment).findOne({
      where: {
        id: commentId
      }
    });
  }

  async save(data) {
    await getRepository(Comment).save(data);
  }
}
