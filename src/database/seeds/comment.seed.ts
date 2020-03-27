import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { Comment } from "../entity/Comment";

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const comments = [
      {
        content: "my name is kirca322",
        userId: 1,
        eventId: 1,
        thumb: 4
      },
      {
        content: "my name is kirca322",
        userId: 1,
        eventId: 2,
        thumb: 2
      },
      {
        content: "my name is kirca322",
        userId: 1,
        eventId: 3,
        thumb: 1
      },
      {
        content: "my name is kim1",
        userId: 2,
        eventId: 1,
        thumb: 1
      },
      {
        content: "my name is kim1",
        userId: 2,
        eventId: 2
      },
      {
        content: "my name is kim2",
        userId: 3,
        eventId: 1
      },
      {
        content: "my name is kim2",
        userId: 3,
        eventId: 2,
        thumb: 1
      },
      {
        content: "my name is kim2",
        userId: 3,
        eventId: 3
      },
      {
        content: "my name is kim3",
        userId: 4,
        eventId: 2
      },
      {
        content: "my name is kim3",
        userId: 4,
        eventId: 3
      }
    ];
    await connection.getRepository(Comment).save(comments);
  }
}
