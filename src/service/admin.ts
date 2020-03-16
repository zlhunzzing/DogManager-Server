import { getConnection } from "typeorm";
import { getRepository } from "typeorm";
import { Events } from "../entity/Events";

interface BodyType {
  eventTitle: string;
  startDate: string;
  endDate: string;
  detailPageUrl: string;
  buttonUrl: string;
  buttonImage: string;
  bannerImage: string;
  pageImage: string;
}

export default class AdminService {
  async addEventService(data: BodyType): Promise<void> {
    const events = new Events();
    const forInsertData = {
      ...events,
      ...data,
      detail_page_url: data.detailPageUrl ? data.detailPageUrl : null,
      button_url: data.buttonUrl ? data.buttonUrl : null
    };
    await getRepository(Events).save(forInsertData);
  }

  async putEventService(data: BodyType, id: string): Promise<void> {
    const result = await getRepository(Events).findOne({
      where: {
        id
      }
    });
    const updatedResult = {
      ...result,
      ...data
    };
    await getRepository(Events).save(updatedResult);
  }

  async getEventListService(): Promise<object> {
    const result = await getRepository(Events).find({
      select: ["id", "eventTitle", "startDate", "endDate", "detailPageUrl"],
      where: {
        isDeleted: false
      }
    });
    return result;
  }

  async getEventEntryService(id: string): Promise<object> {
    const result = await getRepository(Events).findOne({
      where: {
        id,
        isDeleted: false
      }
    });
    return result;
  }

  async deleteEventService(id: string): Promise<void> {
    const result = await getRepository(Events).findOne({
      where: {
        id
      }
    });
    result.isDeleted = true;
    await getRepository(Events).save(result);
  }
}
