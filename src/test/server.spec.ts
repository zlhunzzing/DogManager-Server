import * as chai from "chai";
import "mocha";
import chaiHttp = require("chai-http");
import app from "../app";
chai.use(chaiHttp);
const expect = chai.expect;
import { createTypeormConnection } from "../utils/createTypeormConnection";

describe("Implemented testcase", () => {
  before(async () => {
    await createTypeormConnection();
  });

  it("should get all event list", done => {
    const agent = chai.request.agent(app);
    // const insertData = await agent.post("/api/admin/events/entry").send({
    //   event_title: "postman2",
    //   start_date: "15:53",
    //   end_date: "16:00",
    //   detail_page_url: "d-page",
    //   button_url: "b-url",
    //   button_image: "b-image",
    //   banner_image: "banner image",
    //   page_image: "page image"
    // });

    // await insertData.get("/api/admin/events/entry/1").end((err, result) => {
    //   console.log("이거: ", result.body);
    //   expect(result).to.have.status(200);
    //   expect(result.body).has.all.keys([
    //     "event_title",
    //     "start_date",
    //     "end_date",
    //     "detail_page_url",
    //     "button_url",
    //     "button_image",
    //     "banner_image",
    //     "page_image",
    //     "id",
    //     "created_at",
    //     "updated_at",
    //     "is_deleted"
    //   ]);
    // });
    agent
      .post("/api/admin/events/entry")
      .send({
        event_title: "new event",
        start_date: "2020-04-01",
        end_date: "2020-04-30",
        detail_page_url: "detail page url",
        button_url: "button url",
        button_image: "button image",
        banner_image: "banner image",
        page_image: "page image"
      })
      .then(res => {
        agent.get("/api/admin/events/entry/1").end((err, res2) => {
          expect(res2).to.have.status(200);
          expect(res2.body).has.all.keys([
            "event_title",
            "start_date",
            "end_date",
            "detail_page_url",
            "button_url",
            "button_image",
            "banner_image",
            "page_image",
            "id",
            "created_at",
            "updated_at",
            "is_deleted"
          ]);
          done();
        });
      });
  });
});
