import { Events } from "../database/entity/Events";
import { getRepository } from "typeorm";

export default class EventsModels {
  async find() {
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

  async findOne(eventId, eventUrl) {
    const options = { isDeleted: false };
    if (eventId) options["id"] = eventId;
    if (eventUrl) options["detailPageUrl"] = eventUrl;
    return await getRepository(Events).findOne({
      where: options
    });
  }

  async save(eventData) {
    await getRepository(Events).save(eventData);
  }
}
