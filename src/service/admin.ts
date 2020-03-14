import { getConnection } from "typeorm";
import { getRepository } from "typeorm";
import { Events } from "../entity/Events";

export default {
  addEventService: data => {
    const {
      event_title,
      start_date,
      end_date,
      detail_page_url,
      button_url,
      button_image,
      banner_image,
      page_image
    } = data;
    return getConnection()
      .createQueryBuilder()
      .insert()
      .into(Events)
      .values([
        {
          event_title,
          start_date,
          end_date,
          detail_page_url: detail_page_url ? detail_page_url : null,
          button_url: button_url ? button_url : null,
          button_image,
          banner_image,
          page_image
        }
      ])
      .execute();
  },

  putEventService: async (data, id) => {
    const {
      event_title,
      start_date,
      end_date,
      detail_page_url,
      button_url,
      button_image,
      banner_image,
      page_image
    } = data;
    const result = await getRepository(Events).findOne({
      where: {
        id
      }
    });
    result.event_title = event_title;
    result.start_date = start_date;
    result.end_date = end_date;
    result.detail_page_url = detail_page_url;
    result.button_url = button_url;
    result.button_image = button_image;
    result.banner_image = banner_image;
    result.page_image = page_image;
    return await getRepository(Events).save(result);
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
        id
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
