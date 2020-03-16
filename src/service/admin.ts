import { getConnection } from "typeorm";
import { getRepository } from "typeorm";
import { Events } from "../entity/Events";

interface BodyType {
  event_title: string;
  start_date: string;
  end_date: string;
  detail_page_url: string;
  button_url: string;
  button_image: string;
  banner_image: string;
  page_image: string;
}

export default class AdminService {
  async addEventService(data: BodyType): Promise<void> {
    const events = new Events();
    const forInsertData = {
      ...events,
      ...data,
      detail_page_url: data.detail_page_url ? data.detail_page_url : null,
      button_url: data.button_url ? data.button_url : null
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
      select: [
        "id",
        "event_title",
        "start_date",
        "end_date",
        "detail_page_url"
      ],
      where: {
        is_deleted: false
      }
    });
    return result;
  }

  async getEventEntryService(id: string): Promise<object> {
    const result = await getRepository(Events).findOne({
      where: {
        id,
        is_deleted: false
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
    result.is_deleted = true;
    await getRepository(Events).save(result);
  }
}
