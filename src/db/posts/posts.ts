import { connection } from "../connection";
import {
  selectPostsTemplate,
  deletePostTemplate,
  insertPostTemplate,
  selectPostByIdTemplate,
  selectUserByIdTemplate,
} from "./query-tamplates";
import { Post } from "./types";
import { AppError } from "../../utils/errors";

export const getPosts = (user_id: string): Promise<Post[]> =>
  new Promise((resolve, reject) => {
    connection.all(selectPostsTemplate, [user_id], (error, results) => {
      if (error) {
        reject(new AppError(`Failed to fetch posts: ${error.message}`, 500, false));
        return;
      }
      resolve(results as Post[]);
    });
  });

export const deletePost = (postId: string): Promise<boolean> =>
  new Promise((resolve, reject) => {
    // First check if post exists
    connection.get(selectPostByIdTemplate, [postId], (error, post) => {
      if (error) {
        reject(new AppError(`Failed to check post existence: ${error.message}`, 500, false));
        return;
      }
      if (!post) {
        reject(new AppError("Post not found", 404));
        return;
      }
      // Delete the post
      connection.run(deletePostTemplate, [postId], function (error) {
        if (error) {
          reject(new AppError(`Failed to delete post: ${error.message}`, 500, false));
          return;
        }
        resolve(this.changes > 0);
      });
    });
  });

export const createPost = (
  postId: string,
  user_id: string,
  title: string,
  body: string,
  createdAt: string
): Promise<Post> =>
  new Promise((resolve, reject) => {
    // First verify user exists
    connection.get(selectUserByIdTemplate, [user_id], (error, user) => {
      if (error) {
        reject(new AppError(`Failed to verify user: ${error.message}`, 500, false));
        return;
      }
      if (!user) {
        reject(new AppError("User not found", 404));
        return;
      }
      // Insert the post
      connection.run(
        insertPostTemplate,
        [postId, user_id, title, body, createdAt],
        function (error) {
          if (error) {
            reject(new AppError(`Failed to create post: ${error.message}`, 500, false));
            return;
          }
          // Fetch the created post
          connection.get(
            selectPostByIdTemplate,
            [postId],
            (error, post) => {
              if (error) {
                reject(new AppError(`Failed to fetch created post: ${error.message}`, 500, false));
                return;
              }
              if (!post) {
                reject(new AppError("Post was created but could not be retrieved", 500, false));
                return;
              }
              resolve(post as Post);
            }
          );
        }
      );
    });
  });
