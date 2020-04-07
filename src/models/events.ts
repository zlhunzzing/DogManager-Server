import { Events } from "../database/entity/Events";
import { getRepository } from "typeorm";

export default class EventsModels {
  async findAll() {
    return await getRepository(Events).find({
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
  }

  async findOneWithEventId(eventId) {
    return await getRepository(Events).findOne({
      where: {
        id: eventId,
        isDeleted: false
      }
    });
  }

  async findOneWithEventUrl(eventUrl) {
    return await getRepository(Events).findOne({
      where: {
        detailPageUrl: eventUrl,
        isDeleted: false
      }
    });
  }

  async save(eventData) {
    await getRepository(Events).save(eventData);
  }
}
