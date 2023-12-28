import sqlite3, { Database, RunResult } from "sqlite3";

class DatabaseManager {
  private db: Database;
  private databaseUrl: string = process.env.DATABASE_URL || "default";

  constructor() {
    this.db = new sqlite3.Database(this.databaseUrl, (err) => {
      if (err) {
        console.error('Error connecting to database:', err.message);
      }
    });
  }

  public run(sql: string, params: any[]): Promise<RunResult> {
    return new Promise<RunResult>((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          console.error('Error executing query:', err.message);
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }

  public get(sql: string, params: any[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.db.get(sql, params, function (err, row) {
        if (err) {
          console.error('Error executing query:', err.message);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  public all(sql: string, params: any[]): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.db.all(sql, params, function (err, rows) {
        if (err) {
          console.error('Error executing query:', err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  public close(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database connection:', err.message);
          reject(err);
        } else {
          console.log('Database connection closed');
          resolve();
        }
      });
    });
  }
}

export default DatabaseManager;
