import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { Chat } from "../entity/Chat";

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const chatData = [
      {
        content: "안녕하세요! 무엇을 도와드릴까요?",
        roomId: 1,
        writer: "admin",
      },
      {
        content:
          "첫 이용시 50% 할인쿠폰 유효기간이 만료되었는데 다시 발급받을 수 없을까요?ㅠㅠ",
        roomId: 1,
        writer: "user",
      },
      {
        content: "안녕하세요! 무엇을 도와드릴까요?",
        roomId: 2,
        writer: "admin",
      },
      {
        content: "안녕하세요! 무엇을 도와드릴까요?",
        roomId: 3,
        writer: "admin",
      },
      {
        content:
          "새봄 영양충전 푸드 패키지에 평일기준 가격만 나와있는것 같은데 주말은 가격이 어떻게 되나요??",
        roomId: 3,
        writer: "user",
      },
      {
        content:
          "죄송합니다 고객님. 해당 쿠폰은 발급일로부터 7일동안만 유효한 쿠폰으로 재발급이 불가합니다. 도움을 드리지 못해 죄송합니다 혹시 다른부분 궁금하신점은 없을까요??",
        roomId: 1,
        writer: "admin",
      },
    ];
    await connection.getRepository(Chat).save(chatData);
  }
}
