import { UserThumbs } from "../database/entity/UserThumbs";
import { getRepository } from "typeorm";

export default class UserThumbsModels {
  async findWithIdAndList(userId, commentList) {
    return await getRepository(UserThumbs).find({
      select: ["commentId"],
      where: commentList.map(x => {
        return {
          commentId: x.id,
          userId
        };
      })
    });
  }

  async save(data) {
    await getRepository(UserThumbs).save(data);
  }

  async delete(options) {
    await getRepository(UserThumbs).delete(options);
  }
}
