import sqlite3, { Database, RunResult } from "sqlite3";
import { DatabaseError } from "builders/errors";

class DatabaseManager {
  protected db: Database;
  protected databaseUrl: string;

  constructor() {
    this.databaseUrl = process.env.DATABASE_URL!;
    this.db = this.connect();
  }

  private connect(): Database {
    const dbConnection = new sqlite3.Database(this.databaseUrl, (err) => {
      if (err) {
        console.error('Error connecting to database:', err.message, err.stack, err.name);
      }
    });

    return dbConnection;
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

  public beginTransaction() {
    return new Promise<void>((resolve, reject) => {
      this.db.run('BEGIN TRANSACTION', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public commit() {
    return new Promise<void>((resolve, reject) => {
      this.db.run('COMMIT', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public rollback() {
    return new Promise<void>((resolve, reject) => {
      this.db.run('ROLLBACK', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public run(sql: string, params: string | number | Array<number | string>): Promise<RunResult> {
    const data = Array.isArray(params) ? params : [params];

    return new Promise<RunResult>((resolve, reject) => {
      this.db.run(sql, data, function (err) {
        if (err) {
          console.error('Error executing query:', err.message);
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }

  public get(sql: string, params: string | number | Array<number | string>): Promise<any> {
    const data = Array.isArray(params) ? params : [params];

    return new Promise<any>((resolve, reject) => {
      this.db.get(sql, data, function (err, row) {
        if (err) {
          console.error('Error executing query:', err.message);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  public all(sql: string, params: string | number | Array<number | string>): Promise<any[]> {
    const data = Array.isArray(params) ? params : [params];

    return new Promise<any[]>((resolve, reject) => {
      this.db.all(sql, data, function (err, rows) {
        if (err) {
          console.error('Error executing query:', err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  public async transaction<T>(
    callback: (dbManager: DatabaseManager) => Promise<T>
  ): Promise<T> {
    const dbManager = new DatabaseManager();
    
    try {
      await dbManager.beginTransaction();
      const result = await callback(dbManager);
      await dbManager.commit();
      
      return result;
    } catch (error) {
      await dbManager.rollback();
      throw DatabaseError.transactionFailed(error);
    } finally {
      await dbManager.close();
    }
  }
}

export default DatabaseManager;


// Proposal to further enhance the resilience of database operations by incorporating effective fallback mechanisms:

// ```js
//  public static async executeTransaction<T>(
//     callback: (dbManager: DatabaseManager) => Promise<T>
//   ): Promise<T> {
//     const dbManager = new DatabaseManager();

//     try {
//       await dbManager.beginTransaction();
      
//       const result = await callback(dbManager);
      
//       await dbManager.commit();
      
//       return result;
//     } catch (error) {
//       await dbManager.rollback();
//       console.error(error);
//       throw error;
//     }
//   }
// ```

