import dotenv from "dotenv";
dotenv.config();
import chai from "chai";
import "mocha";
import chaiHttp = require("chai-http");
import app from "../app";
chai.use(chaiHttp);
const expect = chai.expect;
import { createTypeormConnection } from "../utils/createTypeormConnection";
import { Events } from "../entity/Events";
import { Admin } from "../entity/Admin";
import { getRepository, getConnection, Repository } from "typeorm";
import jwt from "jsonwebtoken";

const dataForCreateEvent = (num: number = 1): object => {
  return {
    eventTitle: `new event ${num}`,
    startDate: "202003161105",
    endDate: "202004012359",
    detailPageUrl: `detail page url ${num}`,
    buttonImage: "button image",
    bannerImage: "banner image",
    pageImage: "page image",
    couponCode: "coupon code"
  };
};

const getToken = () => {
  const token = jwt.sign(
    {
      id: 1,
      email: "admin@dogmate.com"
    },
    process.env.JWT_ADMIN_SECRET_KEY,
    {
      expiresIn: "1h"
    }
  );
  return token;
};

describe("Implemented testcase", () => {
  before(async () => {
    await createTypeormConnection();
    const adminInfo = {
      email: "admin@dogmate.com",
      password: "1234"
    };
    await getRepository(Admin).save(adminInfo);
  });
  afterEach(async () => {
    const repository = await getRepository(Events);
    await repository.query(`TRUNCATE TABLE events;`);
  });

  describe("EVENT API TEST", () => {
    beforeEach(() => {
      getConnection()
        .createQueryBuilder()
        .insert()
        .into(Events)
        .values([dataForCreateEvent(1), dataForCreateEvent(3)])
        .execute();
    });
    describe("POST /api/admin/events/entry", () => {
      it("should create a new event", done => {
        const agent = chai.request.agent(app);
        agent
          .post("/api/admin/events/entry")
          .set("Authorization", getToken())
          .field("eventTitle", "new event 4")
          .field("startDate", "202003161105")
          .field("endDate", "202004012359")
          .field("detailPageUrl", "detail page url")
          .field("couponCode", "code1234")
          .field("buttonImage", "button image")
          .field("bannerImage", "banner image")
          .field("pageImage", "page image")
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(201);
            done();
          });
      });
    });

    // describe("Data exist Already", () => {
    // beforeEach(() => {
    //   getConnection()
    //     .createQueryBuilder()
    //     .insert()
    //     .into(Events)
    //     .values([dataForCreateEvent(1), dataForCreateEvent(3)])
    //     .execute();
    // });
    describe("GET /api/admin/events/list", () => {
      it("should get all event lists", done => {
        const agent = chai.request.agent(app);
        agent
          .get("/api/admin/events/list")
          .set("Authorization", getToken())
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body.eventList.length).to.equal(2);
            done();
          });
      });
    });

    describe("GET /api/admin/events/entry/:id", () => {
      it("should get information of selected event", done => {
        const agent = chai.request.agent(app);
        agent
          .get("/api/admin/events/entry/1")
          .set("Authorization", getToken())
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body).has.all.keys([
              "eventTitle",
              "startDate",
              "endDate",
              "detailPageUrl",
              "couponCode",
              "buttonImage",
              "bannerImage",
              "pageImage",
              "id",
              "createdAt",
              "updatedAt",
              "isDeleted",
              "couponName",
              "couponList"
            ]);
            done();
          });
      });
    });

    describe("PUT /api/admin/events/entry/:id", () => {
      it("should edit a information of event", done => {
        const agent = chai.request.agent(app);
        agent
          .put("/api/admin/events/entry/1")
          .set("Authorization", getToken())
          .field("eventTitle", "new event 2")
          .field("startDate", "202003161105")
          .field("endDate", "202004012359")
          .field("detailPageUrl", "detail page url")
          .field("couponCode", "code1234")
          .field("buttonImage", "button image")
          .field("bannerImage", "banner image")
          .field("pageImage", "page image")
          .then(() => {
            agent
              .get("/api/admin/events/entry/1")
              .set("Authorization", getToken())
              .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(200);
                expect(res.body.eventTitle).to.equal("new event 2");
                done();
              });
          });
      });
    });

    describe("DELETE /api/admin/events/entry/:id", () => {
      it("should delete event", done => {
        const agent = chai.request.agent(app);
        agent
          .delete("/api/admin/events/entry/1")
          .set("Authorization", getToken())
          .then(() => {
            agent
              .get("/api/admin/events/list")
              .set("Authorization", getToken())
              .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(200);
                expect(res.body.eventList.length).to.equal(1);
                done();
              });
          });
      });
    });
    // });
  });

  describe("LOGIN API TEST", () => {
    describe("POST /api/admin/signin", () => {
      beforeEach(async () => {
        const adminData = {
          email: "admin@dogmate.com",
          password: "1234"
        };
        await getRepository(Admin).save(adminData);
      });
      afterEach(async () => {
        const repository = await getRepository(Admin);
        await repository.query(`TRUNCATE TABLE admin;`);
      });
      it("should login with admin's ID", done => {
        const agent = chai.request.agent(app);
        agent
          .post("/api/admin/signin")
          .send({
            email: "admin@dogmate.com",
            password: "1234"
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body).has.all.keys(["token"]);
            done();
          });
      });
    });

    describe("POST /api/user/signup", () => {
      it("it should response 201 status code with user info to signup data", done => {
        const agent = chai.request.agent(app);
        agent
          .post("/api/user/signup")
          .send({
            name: "user",
            email: "user@dogmate.com",
            password: "1234",
            mobile: "1234",
            address: "string"
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(201);
            done();
          });
      });
    });

    describe("POST /api/user/signin", () => {
      beforeEach(async () => {
        const agent = chai.request.agent(app);
        await agent.post("/api/user/signup").send({
          name: "user",
          email: "user@dogmate.com",
          password: "1234",
          mobile: "1234",
          address: "string"
        });
      });
      it("should have a token", done => {
        const agent = chai.request.agent(app);
        agent
          .post("/api/user/signin")
          .send({
            email: "user@dogmate.com",
            password: "1234"
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body).has.all.keys(["token"]);
            done();
          });
      });
    });
  });

  describe("COUPON API TEST", () => {
    describe("POST /api/admin/coupon", () => {});
    describe("POST /api/user/coupon", () => {});
    describe("GET /api/admin/coupon/list", () => {});
    describe("GET /api/user/coupon/list", () => {});
    describe("DELETE /api/admin/coupon/:id", () => {});
  });
});
