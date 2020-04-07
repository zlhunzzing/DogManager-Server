import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { Comment } from "../entity/Comment";

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const comments = [
      {
        content:
          "처음 이용해보는 서비스라 가격대가 좀 부담됐었는데 너무 좋은 이벤트 같아요!",
        userId: 1,
        eventId: 1,
        thumb: 8,
      },
      {
        content: "반값이나 할인이라니.....",
        userId: 2,
        eventId: 1,
        thumb: 3,
      },
    ];
    await connection.getRepository(Comment).save(comments);
  }
}
