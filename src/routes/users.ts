import { Router, Request, Response, NextFunction } from "express";

import { getUserById, getUsers, getUsersCount } from "../db/users/users";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/errors";
import { sendSuccess } from "../utils/responseHandler";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Support both pageNumber/pageSize (required) and page/limit (backward compatibility)
    const pageNumber = Number(req.query.pageNumber || req.query.page) || 1;
    const pageSize = Number(req.query.pageSize || req.query.limit) || 10;
    
    if (pageNumber < 1 || pageSize < 1) {
      throw new AppError("Page and limit must be greater than 0", 400);
    }

    const [users, total] = await Promise.all([
      getUsers(pageNumber, pageSize),
      getUsersCount()
    ]);

    const totalPages = Math.ceil(total / pageSize);

    sendSuccess(res, 200, "Users fetched successfully", {
      users,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        totalPages
      }
    });
  })
);

//get user by id

router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!id) {
      throw new AppError("User ID is required", 400);
    }
    const user = await getUserById(id);
    sendSuccess(res, 200, "User fetched successfully", user);
  })
);



router.get(
  "/count",
  asyncHandler(async (req: Request, res: Response, next: NextFunction ) => {
    const count = await getUsersCount();
    sendSuccess(res, 200, "User count fetched successfully", { count });
  })
);

export default router;
