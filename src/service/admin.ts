import { getConnection } from "typeorm";
import { getRepository } from "typeorm";
import { Events } from "../entity/Events";

export default {
  addEventService: data => {
    return getConnection()
      .createQueryBuilder()
      .insert()
      .into(Events)
      .values([
        {
          ...data,
          detail_page_url: data.detail_page_url ? data.detail_page_url : null,
          button_url: data.button_url ? data.button_url : null
        }
      ])
      .execute();
  },

  putEventService: async (data, id) => {
    const result = await getRepository(Events).findOne({
      where: {
        id
      }
    });
    const updatedResult = {
      ...result,
      ...data
    };
    return await getRepository(Events).save(updatedResult);
  },

  getEventListService: async () => {
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
  },

  getEventEntryService: async id => {
    const result = await getRepository(Events).findOne({
      where: {
        id,
        is_deleted: false
      }
    });
    return result;
  },

  deleteEventService: async id => {
    const result = await getRepository(Events).findOne({
      where: {
        id
      }
    });
    result.is_deleted = true;
    await getRepository(Events).save(result);
  }
};
