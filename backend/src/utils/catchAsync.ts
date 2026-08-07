import type { NextFunction, Request, Response } from "express";

export default function catchAsync<T extends Request>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<void>,
) {
  return (req: T, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
