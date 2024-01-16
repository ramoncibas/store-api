import fs from 'fs';
import DatabaseManager from "../../database/db";
import config from 'config/environment';
import seeds from './seeds';

class Seeder extends DatabaseManager {
  constructor() {
    super();
  }

  private async insertData(tableName: string, data: any[]) {
    try {
      if (!data || data.length === 0) {
        return;
      }
  
      const columns = Object.keys(data[0]).join(', ');
      const placeholders = Object.keys(data[0]).map(() => '?').join(', ');
  
      const insertionPromises = data.map(async (item) => {
        const values = Object.values(item);
        const query = `INSERT OR IGNORE INTO ${tableName} (${columns}) VALUES (${placeholders})`;
  
        try {
          this.db.run(query, values);        
        } catch (error) {
          console.log(`Record already exists in table ${tableName}. Skipping insertion.`);
        }
      });
  
      await Promise.all(insertionPromises);
    } catch (error: any) {
      console.error('Error in insertData:', error.message);
    }
  }

  public async seedDatabase() {
    try {
      const seedData = await seeds();

      for (const [tableName, data] of Object.entries(seedData)) {
        // console.log(`Seeding ${tableName}...`);
        await this.insertData(tableName, data);
      }
      console.log('Seeding completed successfully.');

    } catch (error: any) {
      console.error('Error seeding tables:', error.message);

    } finally {
      if (this.db) this.db.close();
    }
  }

  public createTables(): void {
    try {
      this.db.exec(config.schema, (err) => {
        if (err) {
          console.error('Error creating tables:', err);
        } else {
          console.log('Tables created successfully');
        }
      });
    } catch (error: any) {
      console.error('Error in createTables:', error.message);
    }
  }

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
      console.error('Error creating database:', error.message);
    } finally {
      // this.db.close();
    }
  }
}

export default Seeder;
