import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { UserThumbs } from "../entity/UserThumbs";

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const userThumbsData = [
      {
        userId: 1,
        commentId: 1,
      },
      {
        userId: 2,
        commentId: 1,
      },
      {
        userId: 2,
        commentId: 2,
      },
      {
        userId: 3,
        commentId: 1,
      },
      {
        userId: 3,
        commentId: 2,
      },
      {
        userId: 4,
        commentId: 1,
      },
      {
        userId: 4,
        commentId: 2,
      },
    ];
    await connection.getRepository(UserThumbs).save(userThumbsData);
  }
}
