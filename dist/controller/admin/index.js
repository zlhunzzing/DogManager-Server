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
const admin_1 = __importDefault(require("../../services/admin"));
const service = new admin_1.default();
exports.default = {
    addEventController: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const data = req.body;
        if (req.files["pageImage"]) {
            data.pageImage = req.files["pageImage"][0].location;
            data.bannerImage = req.files["bannerImage"][0].location;
            data.buttonImage = req.files["buttonImage"][0].location;
        }
        const result = yield service.addEventService(data);
        if (result["key"] === "detailPageUrl") {
            res.status(409).send("detailPageUrl");
        }
        else {
            res.status(201).end();
        }
    }),
    putEventController: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const data = req.body;
        if (req.files["pageImage"]) {
            data.pageImage = req.files["pageImage"][0].location;
        }
        if (req.files["bannerImage"]) {
            data.bannerImage = req.files["bannerImage"][0].location;
        }
        if (req.files["buttonImage"]) {
            data.buttonImage = req.files["buttonImage"][0].location;
        }
        yield service.putEventService(data, req.params.id);
        res.status(200).end();
    }),
    getEventListController: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield service.getEventListService();
        res.status(200).json({ eventList: result });
    }),
    getEventEntryController: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield service.getEventEntryService(req.params.id);
        res.status(200).json(result);
    }),
    deleteEventController: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield service.deleteEventService(req.params.id);
        res.status(200).end();
    })
};
