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
        detailPageUrl: `/event2`,
        buttonImage:
          "https://dogmate-image.s3.ap-northeast-2.amazonaws.com/1586004580070.png",
        bannerImage:
          "https://dogmate-image.s3.ap-northeast-2.amazonaws.com/1586004580064.png",
        pageImage:
          "https://dogmate-image.s3.ap-northeast-2.amazonaws.com/1586004580062.png",
        couponCode: "@dogmate2",
      },
      {
        eventTitle: "맞춤형 펫푸드 펫픽 50,000원 특가!",
        startDate: "202003010000",
        endDate: "202003311200",
        detailPageUrl: `/event3`,
        buttonImage:
          "https://dogmate-image.s3.ap-northeast-2.amazonaws.com/1586095005518.png",
        bannerImage:
          "https://dogmate-image.s3.ap-northeast-2.amazonaws.com/1586095005494.png",
        pageImage:
          "https://dogmate-image.s3.ap-northeast-2.amazonaws.com/1586095005485.png",
        couponCode: "@dogmate2",
      },
      {
        eventTitle: "반려동물 패키지 여행 펫츠고 5% 할인!",
        startDate: "202002010000",
        endDate: "202002291200",
        detailPageUrl: `/event4`,
        buttonImage:
          "https://dogmate-image.s3.ap-northeast-2.amazonaws.com/1586095085147.png",
        bannerImage:
          "https://dogmate-image.s3.ap-northeast-2.amazonaws.com/1586095085143.png",
        pageImage:
          "https://dogmate-image.s3.ap-northeast-2.amazonaws.com/1586095085140.png",
        couponCode: "@dogmate2",
      },
      {
        eventTitle: "해외에서 데이터 고플땐? 와이파이 도시락 10% 할인!",
        startDate: "202005010000",
        endDate: null,
        detailPageUrl: `/event5`,
        buttonImage:
          "https://dogmate-image.s3.ap-northeast-2.amazonaws.com/1586095153842.png",
        bannerImage:
          "https://dogmate-image.s3.ap-northeast-2.amazonaws.com/1586095153838.png",
        pageImage:
          "https://dogmate-image.s3.ap-northeast-2.amazonaws.com/1586095153836.png",
        couponCode: "@dogmate5",
      },
    ];
    await connection.getRepository(Events).save(eventData);
  }
}
