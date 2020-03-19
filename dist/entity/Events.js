"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
let Events = class Events {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Events.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Events.prototype, "eventTitle", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Events.prototype, "startDate", void 0);
__decorate([
    typeorm_1.Column({
        nullable: true
    }),
    __metadata("design:type", String)
], Events.prototype, "endDate", void 0);
__decorate([
    typeorm_1.Column({
        nullable: true
    }),
    __metadata("design:type", String)
], Events.prototype, "detailPageUrl", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Events.prototype, "buttonImage", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Events.prototype, "bannerImage", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Events.prototype, "pageImage", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", String)
], Events.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", String)
], Events.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column({
        type: "boolean",
        default: false
    }),
    __metadata("design:type", Boolean)
], Events.prototype, "isDeleted", void 0);
__decorate([
    typeorm_1.Column({
        nullable: true
    }),
    __metadata("design:type", String)
], Events.prototype, "couponCode", void 0);
Events = __decorate([
    typeorm_1.Entity()
], Events);
exports.Events = Events;
