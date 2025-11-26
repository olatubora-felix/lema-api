import { Router, Request, Response, NextFunction } from "express";
import { getPosts, deletePost, createPost } from "../db/posts/posts";
import { v4 as uuidv4 } from "uuid";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/errors";
import { sendSuccess } from "../utils/responseHandler";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.query.userId?.toString();
    if (!userId) {
      throw new AppError("userId is required", 400);
    }
    const posts = await getPosts(userId);
    sendSuccess(res, 200, "Posts fetched successfully", { posts });
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const postId = req.params.id;
    if (!postId) {
      throw new AppError("Post ID is required", 400);
    }
    await deletePost(postId);
    sendSuccess(res, 200, "Post deleted successfully", null);
  })
);

router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { title, body, user_id } = req.body;

    // Validate input
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      throw new AppError("Title is required and must be a non-empty string", 400);
    }
    if (!body || typeof body !== "string" || body.trim().length === 0) {
      throw new AppError("Body is required and must be a non-empty string", 400);
    }
    if (!user_id || typeof user_id !== "string" || user_id.trim().length === 0) {
      throw new AppError("User ID is required and must be a non-empty string", 400);
    }

    // Generate post ID (UUID v4 without dashes to match database format) and timestamp
    const postId = uuidv4().replace(/-/g, "");
    const createdAt = new Date().toISOString();

    const post = await createPost(postId, user_id, title.trim(), body.trim(), createdAt);
    sendSuccess(res, 201, "Post created successfully", { post });
  })
);

export default router;
