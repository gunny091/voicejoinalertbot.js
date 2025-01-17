import sqlite3 from "sqlite3";
import { open } from "sqlite";

export default async function getDB(filename) {
  return await open({
    filename: filename,
    driver: sqlite3.Database,
  });
}
