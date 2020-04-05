import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { Events } from "../entity/Events";

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const eventData = [
      {
        eventTitle: "첫 이용시 50% 할인",
        startDate: "202004010000",
        endDate: null,
        detailPageUrl: `/event1`,
        buttonImage:
          "https://dogmate-image.s3.ap-northeast-2.amazonaws.com/1586004507026.png",
        bannerImage:
          "https://dogmate-image.s3.ap-northeast-2.amazonaws.com/1586004506993.png",
        pageImage:
          "https://dogmate-image.s3.ap-northeast-2.amazonaws.com/1586004506976.png",
        couponCode: "@dogmate1",
      },
      {
        eventTitle: "프레이저 플레이스 객실 패키지 10% 할인",
        startDate: "202004010000",
        endDate: null,
        detailPageUrl: `/detail2`,
        buttonImage:
          "https://dogmate-image.s3.ap-northeast-2.amazonaws.com/1586004580070.png",
        bannerImage:
          "https://dogmate-image.s3.ap-northeast-2.amazonaws.com/1586004580064.png",
        pageImage:
          "https://dogmate-image.s3.ap-northeast-2.amazonaws.com/1586004580062.png",
        couponCode: "@dogmate2",
      },
    ];
    await connection.getRepository(Events).save(eventData);
  }
}
