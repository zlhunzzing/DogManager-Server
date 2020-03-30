import dotenv from "dotenv";
dotenv.config();
import chai from "chai";
import "mocha";
import chaiHttp = require("chai-http");
import app from "../app";
chai.use(chaiHttp);
const expect = chai.expect;
import { createTypeormConnection } from "../utils/createTypeormConnection";
import { Events } from "../database/entity/Events";
import { Admin } from "../database/entity/Admin";
import { Coupon } from "../database/entity/Coupon";
import { User } from "../database/entity/User";
import { UserCoupon } from "../database/entity/UserCoupon";
import { Comment } from "../database/entity/Comment";
import { UserThumbs } from "../database/entity/UserThumbs";
import { getRepository } from "typeorm";
import crypto from "crypto";

const dataForCreateEvent = (num: number = 1): object => {
  return {
    eventTitle: `new event ${num}`,
    startDate: "202003161105",
    endDate: "202004012359",
    detailPageUrl: `/detail${num}`,
    buttonImage: "button image",
    bannerImage: "banner image",
    pageImage: "page image",
    couponCode: "coupon code"
  };
};

let adminToken;
let userToken;

describe("Implemented testcase", () => {
  before(async () => {
    await createTypeormConnection();
    const adminInfo = {
      email: "admin@dogmate.com",
      password: "1234"
    };
    await getRepository(Admin).save(adminInfo);
    const shasum = crypto.createHmac("sha512", process.env.CRYPTO_SECRET_KEY);
    shasum.update("1234");
    const userInfo = {
      email: "user1@dogmate.com",
      password: shasum.digest("hex"),
      name: "testUser",
      mobile: "010-0000-0000",
      address: "test address"
    };
    await getRepository(User).save(userInfo);
    chai
      .request(app)
      .post("/api/admin/signin")
      .send({
        email: "admin@dogmate.com",
        password: "1234"
      })
      .end((err, res) => {
        adminToken = res.body.token;
      });
    chai
      .request(app)
      .post("/api/user/signin")
      .send({
        email: "user1@dogmate.com",
        password: "1234"
      })
      .end((err, res) => {
        userToken = res.body.token;
      });
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
          .set("Authorization", adminToken)
          .field("eventTitle", "new event 3")
          .field("startDate", "202003161105")
          .field("endDate", "202004012359")
          .field("detailPageUrl", "detail page url")
          .field("couponCode", "code1234")
          .field("buttonImage", "button image")
          .field("bannerImage", "banner image")
          .field("pageImage", "page image")
          .end((err, res2) => {
            if (err) done(err);
            expect(res2).to.have.status(201);
            done();
          });
      });
      it("If the detailPageUrl is duplicated, the status code 409 must be returned", done => {
        const agent = chai.request.agent(app);
        agent
          .post("/api/admin/events/entry")
          .set("Authorization", adminToken)
          .field("eventTitle", "new event 3")
          .field("startDate", "202003161105")
          .field("endDate", "202004012359")
          .field("detailPageUrl", "/detail1")
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
          .set("Authorization", adminToken)
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
          .set("Authorization", adminToken)
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
          .set("Authorization", adminToken)
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
              .set("Authorization", adminToken)
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
          .set("Authorization", adminToken)
          .field("eventTitle", "new event 1")
          .field("startDate", "202003161105")
          .field("endDate", "202004012359")
          .field("detailPageUrl", "/detail2")
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
          .set("Authorization", adminToken)
          .then(() => {
            agent
              .get("/api/admin/events/list")
              .set("Authorization", adminToken)
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
          .set("Authorization", adminToken)
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
          .set("Authorization", adminToken)
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
          .set("Authorization", adminToken)
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
          .set("Authorization", adminToken)
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
          .set("Authorization", userToken)
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
          .set("Authorization", userToken)
          .send({
            couponCode: "testCoupon",
            expiredAt: "202104010200"
          })
          .then(res => {
            expect(res).to.have.status(201);
            agent
              .post("/api/user/coupon")
              .set("Authorization", userToken)
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
          .set("Authorization", adminToken)
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
          .set("Authorization", adminToken)
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
          .set("Authorization", userToken);
      });

      it("should get user's coupons", done => {
        const agent = chai.request.agent(app);
        agent
          .get("/api/user/coupon/list")
          .set("Authorization", userToken)
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
          .set("Authorization", adminToken)
          .then(res1 => {
            expect(res1).to.have.status(200);
            agent
              .get("/api/admin/coupon/list")
              .set("Authorization", adminToken)
              .end((err, res2) => {
                expect(res2.body.couponList.length).to.equal(1);
                done();
              });
          });
      });
    });

    describe("GET /api/admin/user/coupon/list", () => {
      before(async () => {
        await getRepository(Events).save(dataForCreateEvent());
        const couponData = {
          couponName: "test coupon",
          couponCode: "@test",
          description: "this is test coupon",
          period: 7,
          discount: "10%"
        };
        await getRepository(Coupon).save(couponData);
        const userCouponData = {
          couponId: 1,
          userId: 1,
          expiredAt: "202005011200"
        };
        await getRepository(UserCoupon).save(userCouponData);
      });
      it("should get user's coupon list", done => {
        const agent = chai.request.agent(app);
        agent
          .get("/api/admin/user/coupon/list")
          .set("Authorization", userToken)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body.couponList).to.have.length(1);
            expect(res.body.couponList[0]).has.all.keys([
              "userName",
              "userEmail",
              "couponName",
              "couponCode",
              "assignedAt",
              "expiredAt",
              "isDeleted"
            ]);
            done();
          });
      });
    });
  });

  describe("COMMENT API TEST", () => {
    afterEach(async () => {
      const CouponTable = await getRepository(Comment);
      await CouponTable.query(`TRUNCATE TABLE comment;`);
      const UserCouponTable = await getRepository(UserThumbs);
      await UserCouponTable.query(`TRUNCATE TABLE user_thumbs;`);
    });
    describe("POST /api/user/comment/entry", () => {
      // 댓글을 추가할 이벤트를 생성
      beforeEach(async () => {
        const data = dataForCreateEvent(1);
        await getRepository(Events).save(data);
      });
      it("댓글을 추가할 수 있어야 한다.", done => {
        const agent = chai.request.agent(app);
        agent
          .post("/api/user/comment/entry")
          .set("Authorization", userToken)
          .send({
            content: "test content",
            eventId: 1
          })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body.commentList).to.have.length(1);
            done();
          });
      });
    });

    describe("PUT /api/user/comment/entry/:commentId", () => {
      // 수정할 댓글을 생성
      beforeEach(async () => {
        const data = dataForCreateEvent(1);
        await getRepository(Events).save(data);
        const comment = {
          content: "testContent",
          userId: 1,
          eventId: 1
        };
        await getRepository(Comment).save(comment);
      });
      it("댓글 수정할 수 있어야 한다.", done => {
        const agent = chai.request.agent(app);
        agent
          .put("/api/user/comment/entry/1")
          .set("Authorization", userToken)
          .send({
            content: "testContent2",
            eventId: 1
          })
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body.commentList[0].content).to.equal("testContent2");
            done();
          });
      });
    });

    describe("DELETE /api/user/comment/entry/:commentId", () => {
      //삭제할 댓글을 생성
      beforeEach(async () => {
        const data = dataForCreateEvent(1);
        await getRepository(Events).save(data);
        const comment = {
          content: "testContent",
          userId: 1,
          eventId: 1
        };
        await getRepository(Comment).save(comment);
      });
      it("댓글을 삭제할 수 있어야 한다.", done => {
        const agent = chai.request.agent(app);
        agent
          .delete("/api/user/comment/entry/1")
          .set("Authorization", userToken)
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body.commentList).to.have.length(0);
            done();
          });
      });
    });

    describe("POST /api/user/comment/entry/thumb/:commentId", () => {
      before(async () => {
        await getRepository(Events).save(dataForCreateEvent());
        const commentData = {
          content: "this is test",
          eventId: 1,
          userId: 1
        };
        await getRepository(Comment).save(commentData);
      });
      it("should add thumb to comment", done => {
        const agent = chai.request.agent(app);
        agent
          .post("/api/user/comment/entry/thumb/1")
          .set("Authorization", userToken)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body.commentList[0].thumb).to.equal(1);
            done();
          });
      });
    });

    describe("DELETE /api/user/comment/entry/thumb/:commentId", () => {
      before(async () => {
        await getRepository(Events).save(dataForCreateEvent());
        const commentData = {
          content: "this is test",
          eventId: 1,
          userId: 1,
          thumb: 1
        };
        await getRepository(Comment).save(commentData);
      });
      it("should delete thumb to comment", done => {
        const agent = chai.request.agent(app);
        agent
          .delete("/api/user/comment/entry/thumb/1")
          .set("Authorization", userToken)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body.commentList[0].thumb).to.equal(0);
            done();
          });
      });
    });

    describe("GET /api/user/thumb/list/:eventUrl", () => {
      before(async () => {
        await getRepository(Events).save(dataForCreateEvent());
        const commentData = {
          content: "this is test",
          eventId: 1,
          userId: 1,
          thumb: 1
        };
        const userThumbsData = {
          userId: 1,
          commentId: 1
        };
        await getRepository(Comment).save(commentData);
        await getRepository(UserThumbs).save(userThumbsData);
      });
      it("should get user's thumbs list", done => {
        const agent = chai.request.agent(app);
        agent
          .get("/api/user/thumb/list/detail1")
          .set("Authorization", userToken)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body.userThumbsList[0]).to.equal(1);
            done();
          });
      });
    });
  });
});
