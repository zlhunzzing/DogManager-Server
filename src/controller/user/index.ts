import { getConnection } from "typeorm";
import { Events } from "../../entity/Events";
import { getRepository } from "typeorm";
import { Request, Response } from "express";

export default {
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
      where: [
        {
          id: req.params.id
        }
      ]
    });
    res.status(200).json(result);
  }
};
