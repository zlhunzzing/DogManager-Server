import { Request } from "express";

export interface EventData {
  eventTitle: string;
  startDate: string;
  endDate: string;
  detailPageUrl: string;
  couponCode: string;
  buttonImage: string;
  bannerImage: string;
  pageImage: string;
}

export interface CouponData {
  couponName: string;
  couponCode: string;
  description: string;
  period: number;
  discount: string;
  expiredAt: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  mobile: string;
  address: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface MulterFile {
  key: string; // Available using `S3`.
  path: string; // Available using `DiskStorage`.
  mimetype: string;
  originalname: string;
  size: number;
}

interface TokenData {
  id: number;
  email: string;
  isUser: boolean;
  iat: number;
  exp: number;
}

export interface Req extends Request {
  tokenData: TokenData;
}
