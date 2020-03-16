import * as chai from "chai";
import "mocha";
import chaiHttp = require("chai-http");
import app from "../app";
chai.use(chaiHttp);
const expect = chai.expect;
import { createTypeormConnection } from "../utils/createTypeormConnection";
import { Events } from "../entity/Events";
import { getRepository, getConnection } from "typeorm";

const dataForCreateEvent = (num: number = 1): object => {
  return {
    event_title: `new event ${num}`,
    start_date: "202003161105",
    end_date: "202004012359",
    detail_page_url: "detail page url",
    button_url: "button url",
    button_image: "button image",
    banner_image: "banner image",
    page_image: "page image"
  };
};

describe("Implemented testcase", () => {
  before(async () => {
    await createTypeormConnection();
  });
  afterEach(async () => {
    const repository = await getRepository(Events);
    await repository.query(`TRUNCATE TABLE events;`);
  });

  describe("POST Method", () => {
    it("should create a new event", done => {
      const agent = chai.request.agent(app);
      agent
        .post("/api/admin/events/entry")
        .send(dataForCreateEvent())
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(201);
          done();
        });
    });
  });
  describe("Data exist Already", () => {
    beforeEach(() => {
      getConnection()
        .createQueryBuilder()
        .insert()
        .into(Events)
        .values([dataForCreateEvent(1), dataForCreateEvent(3)])
        .execute();
    });
    describe("GET Method", () => {
      it("should get all event lists", done => {
        const agent = chai.request.agent(app);
        agent.get("/api/admin/events/list").end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body.eventList.length).to.equal(2);
          expect(res.body.eventList[0]).has.all.keys([
            "id",
            "event_title",
            "start_date",
            "end_date",
            "detail_page_url"
          ]);
          done();
        });
      });

      it("should get information of selected event", done => {
        const agent = chai.request.agent(app);
        agent.get("/api/admin/events/entry/1").end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).has.all.keys([
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

    describe("PUT Method", () => {
      it("should edit a information of event", done => {
        const agent = chai.request.agent(app);
        agent
          .put("/api/admin/events/entry/1")
          .send(dataForCreateEvent(2))
          .then(() => {
            agent.get("/api/admin/events/entry/1").end((err, res) => {
              if (err) done(err);
              expect(res).to.have.status(200);
              expect(res.body.event_title).to.equal("new event 2");
              done();
            });
          });
      });
    });

    describe("DELETE Method", () => {
      it("should delete event", done => {
        const agent = chai.request.agent(app);
        agent.delete("/api/admin/events/entry/1").then(() => {
          agent.get("/api/admin/events/list").end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body.eventList.length).to.equal(1);
            done();
          });
        });
      });
    });
  });
});
