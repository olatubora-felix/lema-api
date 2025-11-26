import { connection } from "../connection";

import {
  selectCountOfUsersTemplate,
  selectUsersTemplate,
  selectUserByIdTemplate,
} from "./query-templates";
import { User } from "./types";
import { AppError } from "../../utils/errors";

interface UserRow {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  street: string | null;
  city: string | null;
  state: string | null;
  zipcode: string | null;
}

export const getUsersCount = (): Promise<number> =>
  new Promise((resolve, reject) => {
    connection.get<{ count: number }>(
      selectCountOfUsersTemplate,
      (error, results) => {
        if (error) {
          reject(new AppError(`Failed to get user count: ${error.message}`, 500, false));
          return;
        }
        if (!results) {
          resolve(0);
          return;
        }
        resolve(results.count);
      }
    );
  });

export const getUsers = (
  pageNumber: number,
  pageSize: number
): Promise<User[]> =>
  new Promise((resolve, reject) => {
    const offset = (pageNumber - 1) * pageSize;
    connection.all<UserRow>(
      selectUsersTemplate,
      [offset, pageSize],
      (error, results) => {
        if (error) {
          reject(new AppError(`Failed to fetch users: ${error.message}`, 500, false));
          return;
        }
        // Transform the results to include address object
        const users: User[] = results.map((row) => {
          const user: User = {
            id: row.id,
            name: row.name,
            username: row.username,
            email: row.email,
            phone: row.phone,
          };
          // Add address if it exists
          if (row.street && row.city && row.state && row.zipcode) {
            user.address = {
              street: row.street,
              city: row.city,
              state: row.state,
              zipcode: row.zipcode,
            };
          }
          return user;
        });
        resolve(users);
      }
    );
  });

export const getUserById = (id: string): Promise<User> =>
  new Promise((resolve, reject) => {
    connection.get<UserRow>(
      selectUserByIdTemplate,
      [id],
      (error, results) => {
        if (error) {
          reject(new AppError(`Failed to get user by id: ${error.message}`, 500, false));
          return;
        }
        if (!results) {
          reject(new AppError("User not found", 404));
          return;
        }
        const user: User = {
          id: results.id,
          name: results.name,
          username: results.username,
          email: results.email,
          phone: results.phone,
        };
        // Add address if it exists
        if (results.street && results.city && results.state && results.zipcode) {
          user.address = {
            street: results.street,
            city: results.city,
            state: results.state,
            zipcode: results.zipcode,
          };
        }
        resolve(user);
      }
    );
  });
