import { getConnection } from "typeorm";
import { User } from "../../entity/User";

export default {
  //   UsersListAction: function(req: Request, res: Response) {
  //     return getConnection()
  //       .getRepository(User)
  //       .find();
  //   },
  info: (req, res) => {
    res.send("user success");
  }
};
