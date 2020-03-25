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
import { Coupon } from "../entity/Coupon";
import { User } from "../entity/User";
import { UserCoupon } from "../entity/UserCoupon";
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

const getUserToken = () => {
  const token = jwt.sign(
    {
      id: 1,
      email: "user@dogmate.com"
    },
    process.env.JWT_USER_SECRET_KEY,
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
    beforeEach(async () => {
      const data = [dataForCreateEvent(1), dataForCreateEvent(2)];
      await getRepository(Events).save(data);
    });
    describe("POST /api/admin/events/entry", () => {
      it("should create a new event", done => {
        const agent = chai.request.agent(app);
        agent
          .post("/api/admin/events/entry")
          .set("Authorization", getToken())
          .field("eventTitle", "new event 3")
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
      it("If the detailPageUrl is duplicated, the status code 409 must be returned", done => {
        const agent = chai.request.agent(app);
        agent
          .post("/api/admin/events/entry")
          .set("Authorization", getToken())
          .field("eventTitle", "new event 3")
          .field("startDate", "202003161105")
          .field("endDate", "202004012359")
          .field("detailPageUrl", "detail page url 1")
          .field("couponCode", "code1234")
          .field("buttonImage", "button image")
          .field("bannerImage", "banner image")
          .field("pageImage", "page image")
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(409);
            expect(res.text).to.equal("detailPageUrl");
            done();
          });
      });
    });

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
          .field("eventTitle", "new event 3")
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
                expect(res.body.eventTitle).to.equal("new event 3");
                done();
              });
          });
      });
      it("If the detailPageUrl is duplicated, the status code 409 must be returned", done => {
        const agent = chai.request.agent(app);
        agent
          .put("/api/admin/events/entry/1")
          .set("Authorization", getToken())
          .field("eventTitle", "new event 1")
          .field("startDate", "202003161105")
          .field("endDate", "202004012359")
          .field("detailPageUrl", "detail page url 2")
          .field("couponCode", "code1234")
          .field("buttonImage", "button image")
          .field("bannerImage", "banner image")
          .field("pageImage", "page image")
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(409);
            expect(res.text).to.equal("detailPageUrl");
            done();
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
            expect(res.body).to.have.property("token");
            done();
          });
      });
      it("should get 409 status code when send non-correct ID", done => {
        const agent = chai.request.agent(app);
        agent
          .post("/api/admin/signin")
          .send({
            email: "nonadmin@dogmate.com",
            password: "1234"
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(409);
            done();
          });
      });
    });

    describe("POST /api/user/signup", () => {
      before(async () => {
        const userData = {
          name: "user2",
          email: "user2@dogmate.com",
          password: "1234",
          mobile: "4321",
          address: "address"
        };
        await getRepository(User).save(userData);
      });
      after(async () => {
        const repository = await getRepository(User);
        await repository.query(`TRUNCATE TABLE user;`);
      });
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
      it("should send 409 status code when email is already exist", done => {
        const agent = chai.request.agent(app);
        agent
          .post("/api/user/signup")
          .send({
            name: "user2",
            email: "user2@dogmate.com",
            password: "1234",
            mobile: "1234",
            address: "string"
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(409);
            done();
          });
      });
    });

    describe("POST /api/user/signin", () => {
      before(async () => {
        const agent = chai.request.agent(app);
        await agent.post("/api/user/signup").send({
          name: "user",
          email: "user@dogmate.com",
          password: "1234",
          mobile: "1234",
          address: "string"
        });
      });
      after(async () => {
        const repository = await getRepository(User);
        await repository.query(`TRUNCATE TABLE user;`);
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
            expect(res.body).to.have.property("token");
            done();
          });
      });
      it("should send 409 status code when user ID is not exist", done => {
        const agent = chai.request.agent(app);
        agent
          .post("/api/user/signin")
          .send({
            email: "test@dogmate.com",
            password: "1234"
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(409);
            expect(res.body).to.not.have.property("token");
            done();
          });
      });
    });
  });

  describe("COUPON API TEST", () => {
    afterEach(async () => {
      const CouponTable = await getRepository(Coupon);
      await CouponTable.query(`TRUNCATE TABLE coupon;`);
      const UserCouponTable = await getRepository(UserCoupon);
      await UserCouponTable.query(`TRUNCATE TABLE user_coupon;`);
    });
    describe("POST /api/admin/coupon", () => {
      beforeEach(async () => {
        const couponData = {
          couponName: "second coupon",
          couponCode: "@second",
          description: "this is first coupon",
          period: 7,
          discount: "20%"
        };
        await getRepository(Coupon).save(couponData);
      });
      it("should create a new coupon", done => {
        const agent = chai.request.agent(app);
        agent
          .post("/api/admin/coupon")
          .set("Authorization", getToken())
          .send({
            couponName: "first coupon",
            couponCode: "@first",
            description: "this is first coupon",
            period: 7,
            discount: "20%"
          })
          .end((err, res) => {
            expect(res).to.have.status(201);
            done();
          });
      });
      it("should send message and 409 code when couponName is already exist", done => {
        const agent = chai.request.agent(app);
        agent
          .post("/api/admin/coupon")
          .set("Authorization", getToken())
          .send({
            couponName: "second coupon",
            couponCode: "@first",
            description: "this is first coupon",
            period: 7,
            discount: "20%"
          })
          .end((err, res) => {
            expect(res).to.have.status(409);
            expect(res.text).to.equal("couponName already exist");
            done();
          });
      });
      it("should send message and 409 code when couponCode is already exist", done => {
        const agent = chai.request.agent(app);
        agent
          .post("/api/admin/coupon")
          .set("Authorization", getToken())
          .send({
            couponName: "third coupon",
            couponCode: "@second",
            description: "this is first coupon",
            period: 7,
            discount: "20%"
          })
          .end((err, res) => {
            expect(res).to.have.status(409);
            expect(res.text).to.equal("couponCode already exist");
            done();
          });
      });
    });
    describe("POST /api/user/coupon", () => {
      before(async () => {
        const userData = {
          name: "user",
          email: "user@dogmate.com",
          password: "1234",
          mobile: "1234",
          address: "string"
        };
        await getRepository(User).save(userData);
      });
      beforeEach(async () => {
        // 발급할 쿠폰 생성
        const agent = chai.request.agent(app);
        await agent
          .post("/api/admin/coupon")
          .set("Authorization", getToken())
          .send({
            couponName: "sale 50 coupon",
            couponCode: "testCoupon",
            description: "thanks",
            period: 7,
            discount: "50"
          });
      });
      afterEach(async () => {
        const UserCouponTable = await getRepository(UserCoupon);
        await UserCouponTable.query(`TRUNCATE TABLE user_coupon;`);
      });
      it("should assign a coupon to user", done => {
        const agent = chai.request.agent(app);
        agent
          .post("/api/user/coupon")
          .set("Authorization", getUserToken())
          .send({
            couponCode: "testCoupon",
            expiredAt: "202104010200"
          })
          .end(async (err, res) => {
            if (err) done(err);
            expect(res).to.have.status(201);
            const result = await getRepository(UserCoupon).find();
            expect(result).to.have.length(1);
            done();
          });
      });
      it("should not assign a coupon when user has that coupon already", done => {
        const agent = chai.request.agent(app);
        agent
          .post("/api/user/coupon")
          .set("Authorization", getUserToken())
          .send({
            couponCode: "testCoupon",
            expiredAt: "202104010200"
          })
          .then(res => {
            expect(res).to.have.status(201);
            agent
              .post("/api/user/coupon")
              .set("Authorization", getUserToken())
              .send({
                couponCode: "testCoupon",
                expiredAt: "202104010200"
              })
              .end((err, res2) => {
                if (err) done(err);
                expect(res2).to.have.status(409);
                done();
              });
          });
      });
    });

    describe("GET /api/admin/coupon/list", () => {
      beforeEach(async () => {
        const couponData1 = {
          couponName: "coupon1",
          couponCode: "code1",
          description: "first coupon",
          period: 7,
          discount: "10%"
        };
        const couponData2 = {
          couponName: "coupon2",
          couponCode: "code2",
          description: "second coupon",
          period: 7,
          discount: "10%"
        };
        const arr = [couponData1, couponData2];
        await getRepository(Coupon).save(arr);
      });
      it("should get all coupon list", done => {
        const agent = chai.request.agent(app);
        agent
          .get("/api/admin/coupon/list")
          .set("Authorization", getToken())
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.couponList.length).to.equal(2);
            done();
          });
      });
    });

    describe("GET /api/user/coupon/list", () => {
      before(async () => {
        // 유저 생성
        const agent = chai.request.agent(app);
        await agent.post("/api/user/signup").send({
          name: "user",
          email: "user@dogmate.com",
          password: "1234",
          mobile: "12341234",
          address: "1"
        });
      });
      // .set("Authorization", getUserToken());
      beforeEach(async () => {
        const agent = chai.request.agent(app);
        await agent
          .post("/api/admin/coupon")
          .set("Authorization", getToken())
          .send({
            couponName: "coupon2",
            couponCode: "code2",
            description: "second coupon",
            period: 7,
            discount: "10%"
          });
        await agent
          .post("/api/user/coupon")
          .send({
            couponCode: "code2",
            expiredAt: "202104010200"
          })
          .set("Authorization", getUserToken());
      });

      it("should get user's coupons", done => {
        const agent = chai.request.agent(app);
        agent
          .get("/api/user/coupon/list")
          .set("Authorization", getUserToken())
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body.couponList).to.have.length(1);
            expect(res.body.couponList[0]).to.has.all.keys([
              "couponName",
              "description",
              "expiredAt"
            ]);
            done();
          });
      });
    });
    describe("DELETE /api/admin/coupon/:id", () => {
      beforeEach(async () => {
        const couponData1 = {
          couponName: "coupon1",
          couponCode: "code1",
          description: "first coupon",
          period: 7,
          discount: "10%"
        };
        const couponData2 = {
          couponName: "coupon2",
          couponCode: "code2",
          description: "second coupon",
          period: 7,
          discount: "10%"
        };
        const arr = [couponData1, couponData2];
        await getRepository(Coupon).save(arr);
      });
      it("should delete coupon", done => {
        const agent = chai.request.agent(app);
        agent
          .delete("/api/admin/coupon/2")
          .set("Authorization", getToken())
          .then(res1 => {
            expect(res1).to.have.status(200);
            agent
              .get("/api/admin/coupon/list")
              .set("Authorization", getToken())
              .end((err, res2) => {
                expect(res2.body.couponList.length).to.equal(1);
                done();
              });
          });
      });
    });
  });
});
