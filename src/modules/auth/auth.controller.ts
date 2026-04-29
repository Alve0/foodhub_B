import { Request, Response } from "express";
import { helper } from "../../lib/catchAsync";

const register = helper.catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
});
