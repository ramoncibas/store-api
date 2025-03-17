import fs from 'fs';
import DatabaseManager from "database/db";
import config from 'config/environment';
import seeds from './seeds';
import { reset, red, green } from 'app/common/colors';

const { NODE_ENV = 'development' } = process.env;

class Seeder extends DatabaseManager {
  constructor() {
    super();
  }

  /**
   * This function is responsible for creating the database tables 
   * based on the schema defined in the `config.schema`.
   * If there's an error, it logs the error message.
   * Otherwise, it confirms the successful creation of the tables.
   **/
  public createTables(): void {
    try {
      this.db.exec(config.schema, (err) => {
        if (err) {
          console.error('Error creating tables:', err);
        } else {
          console.log(`${green}🛠️  Tables created successfully.${reset}`);
        }
      });
    } catch (error: any) {
      console.error(`${red}❌  Error in createTables:${reset} ${error.message}`);
    }
  }

  /**
   * This function checks if the database file exists at the specified `databaseUrl`.
   * If the database does not exist, it creates a new one.
   * After ensuring the database file exists, it proceeds to create the tables.
   * If an error occurs at any step, it logs the error message.
   **/
  public createDatabase(): void {
    try {
      if (!this.databaseUrl) {
        console.error('Error: Database URL is undefined.', this.databaseUrl);
        return;
      }

      if (!fs.existsSync(this.databaseUrl)) {
        console.log('Database does not exist. Creating...');
        fs.writeFileSync(this.databaseUrl, '');
      }
      this.createTables();
    } catch (error: any) {
      console.error('Error creating database: ', error.message);
    } finally {
      // this.db.close();
    }
  }

  /**
   * This is a helper function that inserts data into the specified table.
   * It takes `tableName` and `data` as parameters.
   * The data is inserted using SQL `INSERT` queries, ensuring that if the record already exists, it is ignored.
   * If an error occurs during insertion, it logs the error.
   * If the data is empty or undefined, it skips the insertion process.
   **/
  private async insertData(tableName: string, data: any[]) {
    try {
      if (!data || data.length === 0) {
        return;
      }

      const columns = Object.keys(data[0]).join(', ');
      const placeholders = Object.keys(data[0]).map(() => '?').join(', ');

      for (const item of data) {
        const values = Object.values(item);
        const query = `INSERT OR IGNORE INTO ${tableName} (${columns}) VALUES (${placeholders})`;

        try {
          await new Promise<void>((resolve, reject) => {
            this.db.run(query, values, (err) => {
              if (err) {
                console.error(`Error inserting into ${tableName}:`, err.message);
                reject(err);
              } else {
                resolve();
              }
            });
          });
        } catch (error) {
          console.log(`Record already exists in table ${tableName}. Skipping insertion.`);
        }
      }
    } catch (error: any) {
      console.error('Error in insertData:', error.message);
    }
  }

  /**
   * This function seeds the database by calling the `seeds()` function 
   * to get the seed data and then inserts the data into the appropriate tables 
   * using the `insertData` helper function.
   * If an error occurs, it logs and returns the error message.
   * Finally, it ensures the database connection is closed.
   ****/
  public async seedDatabase() {
    try {
      const seedData = await seeds();

      for (const [tableName, data] of Object.entries(seedData)) {
        // console.log(`Seeding ${tableName}...`);
        await this.insertData(tableName, data);
      }
    } catch (error: any) {
      return error.message;

    } finally {
      if (this.db) this.db.close();
    }
  }
}

/**
 * This is the main function for creating and seeding the database.
 * It only runs in the 'development' environment.
 * It first calls the `createDatabase` method to create the database and tables,
 * then it calls `seedDatabase` to insert the seed data.
 * Any errors that occur during this process are logged to the console.
 **/
export const createAndSeedDatabase = async () => {
  if (NODE_ENV === 'development') {
    const seeder = new Seeder();
    try {
      seeder.createDatabase();
      await seeder.seedDatabase();
      console.log(`${green}🌱 Seeding completed successfully.${reset}`);
    } catch (err) {
      console.error(`${red}❌ Error during seeding or database creation:${reset}`, err);
    }
  }
};

export default Seeder;


