import express, { Application } from "express";
import config from "config";
import postsRouter from "./routes/posts";
import usersRouter from "./routes/users";
import { errorHandler } from "./middleware/errorHandler";
import { initializeDatabase, seedDatabase } from "./db/init";

const port = config.get("port") as number;

const app: Application = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/posts", postsRouter);
app.use("/users", usersRouter);

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize database, seed data, and start server
initializeDatabase()
  .then(() => seedDatabase())
  .then(() => {
    app.listen(port, () => {
      console.log(`API server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });
