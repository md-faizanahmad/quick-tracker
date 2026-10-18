import type { Request, Response, NextFunction } from "express";

export type AppReq<T = unknown> = Request<unknown, unknown, T>;
export type AppRes = Response;
export type AppNext = NextFunction;
