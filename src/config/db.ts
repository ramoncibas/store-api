import fs from 'fs';
import sqlite3, { Database, RunResult } from "sqlite3";
import config from '../config/config';
import bcrypt from 'bcryptjs';

class DatabaseManager {
  private db: Database;
  private databaseUrl: string = config.database;

  constructor() {
    if (!fs.existsSync(this.databaseUrl)) {
      console.log('Database does not exist. Creating...');
      fs.writeFileSync(this.databaseUrl, '');
      
 
    }

    this.db = new sqlite3.Database(this.databaseUrl, (err) => {
      if (err) {
        console.error('Error connecting to database:', err);
      } else {
        console.log('Connected to database');
        this.createTables();
        this.seeds();
      }
    });
  }

  private createTables(): void {
    // Execute o script de criação de tabelas se elas não existirem
    this.db.exec(config.schema, (err) => {
      if (err) {
        console.error('Error creating tables:', err.message);
      } else {
        console.log('Tables created successfully');
      }
    });
  }

  private async seeds(): Promise<void> {
    // Execute o script de seeds para popular as tabelas no ambiente de dev
    const encryptedPassword = await bcrypt.hash('store#123', 10);

    this.db.exec(`
      INSERT INTO user (uuid, first_name, last_name, email, password, phone, user_picture_name, type)
      VALUES ('Store', 'Admin', 'store@admin.com', ${encryptedPassword}, '123456789', 'user.jpg', 'user');

      INSERT INTO customer (uuid, user_id, shipping_address, card_number, card_expiry_date, card_security_code)
      VALUES ('2', 1, '123 Main St', '1234567890123456', '12/23', '123');
    `, (err) => {
      if (err) {
        console.error('Error seeding tables:', err.message);
      } else {
        console.log('Tables seeded successfully');
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
