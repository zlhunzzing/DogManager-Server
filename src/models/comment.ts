import { Comment } from "../database/entity/Comment";
import { getRepository } from "typeorm";

export default class CommentModels {
  async findWithEventId(eventId) {
    return await getRepository(Comment).find({
      where: {
        isDeleted: false,
        eventId
      }
    });
  }

  async findOneWithCommentId(commentId) {
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
