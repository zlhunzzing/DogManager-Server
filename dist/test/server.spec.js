"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
require("mocha");
const chaiHttp = require("chai-http");
const app_1 = __importDefault(require("../app"));
chai_1.default.use(chaiHttp);
const expect = chai_1.default.expect;
const createTypeormConnection_1 = require("../utils/createTypeormConnection");
const Events_1 = require("../entity/Events");
const typeorm_1 = require("typeorm");
const dataForCreateEvent = (num = 1) => {
    return {
        eventTitle: `new event ${num}`,
        startDate: "202003161105",
        endDate: "202004012359",
        detailPageUrl: "detail page url",
        buttonUrl: "button url",
        buttonImage: "button image",
        bannerImage: "banner image",
        pageImage: "page image"
    };
};
describe("Implemented testcase", () => {
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        yield createTypeormConnection_1.createTypeormConnection();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const repository = yield typeorm_1.getRepository(Events_1.Events);
        yield repository.query(`TRUNCATE TABLE events;`);
    }));
    describe("POST Method", () => {
        it("should create a new event", done => {
            const agent = chai_1.default.request.agent(app_1.default);
            agent
                .post("/api/admin/events/entry")
                .send(dataForCreateEvent())
                .end((err, res) => {
                if (err)
                    done(err);
                expect(res).to.have.status(201);
                done();
            });
        });
    });
    describe("Data exist Already", () => {
        beforeEach(() => {
            typeorm_1.getConnection()
                .createQueryBuilder()
                .insert()
                .into(Events_1.Events)
                .values([dataForCreateEvent(1), dataForCreateEvent(3)])
                .execute();
        });
        describe("GET Method", () => {
            it("should get all event lists", done => {
                const agent = chai_1.default.request.agent(app_1.default);
                agent.get("/api/admin/events/list").end((err, res) => {
                    if (err)
                        done(err);
                    expect(res).to.have.status(200);
                    expect(res.body.eventList.length).to.equal(2);
                    expect(res.body.eventList[0]).has.all.keys([
                        "id",
                        "eventTitle",
                        "startDate",
                        "endDate",
                        "detailPageUrl"
                    ]);
                    done();
                });
            });
            it("should get information of selected event", done => {
                const agent = chai_1.default.request.agent(app_1.default);
                agent.get("/api/admin/events/entry/1").end((err, res) => {
                    if (err)
                        done(err);
                    expect(res).to.have.status(200);
                    expect(res.body).has.all.keys([
                        "eventTitle",
                        "startDate",
                        "endDate",
                        "detailPageUrl",
                        "buttonUrl",
                        "buttonImage",
                        "bannerImage",
                        "pageImage",
                        "id",
                        "createdAt",
                        "updatedAt",
                        "isDeleted"
                    ]);
                    done();
                });
            });
        });
        describe("PUT Method", () => {
            it("should edit a information of event", done => {
                const agent = chai_1.default.request.agent(app_1.default);
                agent
                    .put("/api/admin/events/entry/1")
                    .send(dataForCreateEvent(2))
                    .then(() => {
                    agent.get("/api/admin/events/entry/1").end((err, res) => {
                        if (err)
                            done(err);
                        expect(res).to.have.status(200);
                        expect(res.body.eventTitle).to.equal("new event 2");
                        done();
                    });
                });
            });
        });
        describe("DELETE Method", () => {
            it("should delete event", done => {
                const agent = chai_1.default.request.agent(app_1.default);
                agent.delete("/api/admin/events/entry/1").then(() => {
                    agent.get("/api/admin/events/list").end((err, res) => {
                        if (err)
                            done(err);
                        expect(res).to.have.status(200);
                        expect(res.body.eventList.length).to.equal(1);
                        done();
                    });
                });
            });
        });
    });
});
