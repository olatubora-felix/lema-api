import { connection } from "./connection";

/**
 * Run a SQL command and return a promise
 */
const runSQL = (sql: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    connection.run(sql, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

/**
 * Initialize the database by creating tables if they don't exist
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Enable foreign keys
    await runSQL("PRAGMA foreign_keys = ON");

    // Create users table
    await runSQL(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL
      )
    `);

    // Create addresses table
    await runSQL(`
      CREATE TABLE IF NOT EXISTS addresses (
        user_id TEXT PRIMARY KEY,
        street TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        zipcode TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create posts table
    await runSQL(`
      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log("Database initialized successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Database initialization failed: ${errorMessage}`);
  }
};

