import { getRepository } from "typeorm";
import { Events } from "../entity/Events";

export default class UserService {
  async getEventListService(): Promise<object> {
    const result = await getRepository(Events).find({
      select: [
        "id",
        "eventTitle",
        "startDate",
        "endDate",
        "detailPageUrl",
        "bannerImage"
      ],
      where: {
        isDeleted: false
      }
    });
    return result;
  }

  async getEventEntryService(url: string): Promise<object> {
    const result = await getRepository(Events).findOne({
      where: {
        detailPageUrl: `/${url}`,
        isDeleted: false
      }
    });
    return result;
  }
}
