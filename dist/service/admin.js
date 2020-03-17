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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Events_1 = require("../entity/Events");
class AdminService {
    addEventService(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const indata = yield typeorm_1.getRepository(Events_1.Events).findOne({
                where: [
                    {
                        detailPageUrl: data.detailPageUrl
                    },
                    { buttonUrl: data.buttonUrl }
                ]
            });
            if (indata) {
                if (indata.detailPageUrl === data.detailPageUrl) {
                    return { key: "detailPageUrl" };
                }
                else if (indata.buttonUrl === data.buttonUrl) {
                    return { key: "buttonUrl" };
                }
            }
            const events = new Events_1.Events();
            const forInsertData = Object.assign(Object.assign(Object.assign({}, events), data), { detailPageUrl: data.detailPageUrl ? data.detailPageUrl : null, buttonUrl: data.buttonUrl ? data.buttonUrl : null });
            yield typeorm_1.getRepository(Events_1.Events).save(forInsertData);
            return { key: "completed" };
        });
    }
    putEventService(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield typeorm_1.getRepository(Events_1.Events).findOne({
                where: {
                    id
                }
            });
            const updatedResult = Object.assign(Object.assign(Object.assign({}, result), data), { buttonImage: data.buttonImage ? data.buttonImage : result.buttonImage, bannerImage: data.bannerImage ? data.bannerImage : result.bannerImage, pageImage: data.pageImage ? data.pageImage : result.pageImage });
            yield typeorm_1.getRepository(Events_1.Events).save(updatedResult);
        });
    }
    getEventListService() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield typeorm_1.getRepository(Events_1.Events).find({
                select: [
                    "id",
                    "eventTitle",
                    "startDate",
                    "endDate",
                    "detailPageUrl",
                    "bannerImage"
                ],
                where: {
                    isDeleted: false
                }
            });
            return result;
        });
    }
    getEventEntryService(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield typeorm_1.getRepository(Events_1.Events).findOne({
                where: {
                    id,
                    isDeleted: false
                }
            });
            return result;
        });
    }
    deleteEventService(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield typeorm_1.getRepository(Events_1.Events).findOne({
                where: {
                    id
                }
            });
            result.isDeleted = true;
            yield typeorm_1.getRepository(Events_1.Events).save(result);
        });
    }
}
exports.default = AdminService;
