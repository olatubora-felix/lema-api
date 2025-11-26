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
 * Run a parameterized SQL command and return a promise
 */
const runSQLWithParams = (sql: string, params: any[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    connection.run(sql, params, (error) => {
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

/**
 * Seed the database with 400 users and 10 posts for each user
 */
export const seedDatabase = async (): Promise<void> => {
  try {
    // Check if database is already seeded
    const userCount = await new Promise<number>((resolve, reject) => {
      connection.get<{ count: number }>(
        "SELECT COUNT(*) as count FROM users",
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result?.count || 0);
          }
        }
      );
    });

    if (userCount > 0) {
      console.log(`Database already contains ${userCount} users. Skipping seed.`);
      return;
    }

    console.log("Starting database seeding...");

    const states = [
      "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
      "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
      "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
      "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
      "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
      "New Hampshire", "New Jersey", "New Mexico", "New York",
      "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
      "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
      "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
      "West Virginia", "Wisconsin", "Wyoming"
    ];

    const cities = [
      "New York", "Los Angeles", "Chicago", "Houston", "Phoenix",
      "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose",
      "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte",
      "San Francisco", "Indianapolis", "Seattle", "Denver", "Washington"
    ];

    const streetNames = [
      "Main St", "Oak Ave", "Park Blvd", "Elm St", "Cedar Ln",
      "Maple Dr", "Pine Rd", "First St", "Second Ave", "Third St"
    ];

    // Generate users and posts
    for (let i = 1; i <= 400; i++) {
      const userId = `user-${i.toString().padStart(3, "0")}`;
      const name = `User ${i}`;
      const username = `user${i}`;
      const email = `user${i}@example.com`;
      const phone = `555-${(1000 + i).toString().slice(-4)}`;

      // Insert user
      await runSQLWithParams(
        "INSERT INTO users (id, name, username, email, phone) VALUES (?, ?, ?, ?, ?)",
        [userId, name, username, email, phone]
      );

      // Insert address
      const streetNum = Math.floor(Math.random() * 9999) + 1;
      const street = `${streetNum} ${streetNames[Math.floor(Math.random() * streetNames.length)]}`;
      const city = cities[Math.floor(Math.random() * cities.length)];
      const state = states[Math.floor(Math.random() * states.length)];
      const zipcode = (10000 + Math.floor(Math.random() * 90000)).toString();

      await runSQLWithParams(
        "INSERT INTO addresses (user_id, street, city, state, zipcode) VALUES (?, ?, ?, ?, ?)",
        [userId, street, city, state, zipcode]
      );

      // Insert 10 posts for this user
      for (let j = 1; j <= 10; j++) {
        const postId = `post-${i.toString().padStart(3, "0")}-${j.toString().padStart(2, "0")}`;
        const title = `Post ${j} by ${name}`;
        const body = `This is post number ${j} by ${name}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;
        
        // Generate a random date within the last year
        const daysAgo = Math.floor(Math.random() * 365);
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - daysAgo);
        const createdAtISO = createdAt.toISOString();

        await runSQLWithParams(
          "INSERT INTO posts (id, user_id, title, body, created_at) VALUES (?, ?, ?, ?, ?)",
          [postId, userId, title, body, createdAtISO]
        );
      }

      // Log progress every 50 users
      if (i % 50 === 0) {
        console.log(`Seeded ${i} users...`);
      }
    }

    console.log("Database seeding completed successfully!");
    console.log(`Created 400 users with addresses and 10 posts each (4000 posts total)`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Database seeding failed: ${errorMessage}`);
  }
};

