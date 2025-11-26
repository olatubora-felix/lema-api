import sqlite3 from "sqlite3";
import config from "config";
import path from "path";
import fs from "fs";

const dbPath = config.get("dbPath") as string;
// Resolve the database path relative to the backend directory
let resolvedPath: string;
if (path.isAbsolute(dbPath)) {
  resolvedPath = dbPath;
} else {
  // Try relative to backend directory (for both src/ and dist/ execution)
  const backendDir = path.join(__dirname, "../..");
  resolvedPath = path.join(backendDir, dbPath);
  
  // Verify the file exists, if not try from process.cwd()
  if (!fs.existsSync(resolvedPath)) {
    const cwdPath = path.join(process.cwd(), dbPath);
    if (fs.existsSync(cwdPath)) {
      resolvedPath = cwdPath;
    }
  }
}

export const connection = new sqlite3.Database(resolvedPath);
