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

  getEventListController: async (req: Request, res: Response) => {
    const result = await getRepository(Events)
      .createQueryBuilder("events")
      .getMany();
    res.status(200).json({ eventList: result });
  },

  getEventEntryController: async (req: Request, res: Response) => {
    const result = await getRepository(Events)
      .createQueryBuilder("events")
      .where("events.id = :id", { id: req.params.id })
      .getOne();
    res.status(200).json(result);
  }
};
