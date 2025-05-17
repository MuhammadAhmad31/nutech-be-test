import { Request, Response, NextFunction } from "express";

export const logMiddlewareRequest = (req: Request, res: Response, next: NextFunction) => {
    console.log("terjadi request ke path", req.path);
    next();
}