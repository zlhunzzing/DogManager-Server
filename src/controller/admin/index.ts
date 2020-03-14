import { getConnection } from "typeorm";
import { Events } from "../../entity/Events";
import { getRepository } from "typeorm";
import { Request, Response } from "express";

export default {
  addEventController: async (req: Request, res: Response) => {
    const {
      event_title,
      start_date,
      end_date,
      detail_page_url,
      button_url,
      button_image,
      banner_image,
      page_image
    } = req.body;

    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Events)
      .values([
        {
          event_title: event_title,
          start_date: start_date,
          end_date: end_date,
          detail_page_url: detail_page_url ? detail_page_url : null,
          button_url: button_url ? button_url : null,
          button_image: button_image,
          banner_image: banner_image,
          page_image: page_image
        }
      ])
      .execute();
    res.status(201).end();
  },

  putEventController: async (req: Request, res: Response) => {
    const {
      event_title,
      start_date,
      end_date,
      detail_page_url,
      button_url,
      button_image,
      banner_image,
      page_image
    } = req.body;

    const result = await getRepository(Events).findOne({
      where: {
        id: req.params.id
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
    await getRepository(Events).save(result);
    res.status(200).end();
  },

  getEventListController: async (req: Request, res: Response) => {
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
    res.status(200).json(result);
  },

  getEventEntryController: async (req: Request, res: Response) => {
    const result = await getRepository(Events).findOne({
      where: {
        id: req.params.id
      }
    });
    res.status(200).json(result);
  },

  deleteEventController: async (req: Request, res: Response) => {
    const result = await getRepository(Events).findOne({
      where: {
        id: req.params.id
      }
    });
    result.is_deleted = true;
    await getRepository(Events).save(result);
    res.status(200).end();
  }
};
