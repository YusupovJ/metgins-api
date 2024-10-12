import { Request } from "express";

export interface IPayload {
  userId: number;
  role: string;
}

export interface IRequest extends Request {
  userId: number;
}
