import DatabaseManager from "../database/db";
import { cleanupTempFiles } from "utils";
import CacheConnection from "lib/cache/cache.connection";

/**
 * Cleans up resources and gracefully exits the application.
 * This function is typically used as a cleanup handler for
 * signals like 'beforeExit', 'SIGINT', and 'SIGTERM'.
 */
async function cleanupAndExit() {
  const dbManager = new DatabaseManager();
  const cacheConnection = new CacheConnection();
  console.log(`Received signal. Cleaning up and exiting...`);

  try {
    // Clean up temporary files
    cleanupTempFiles();

    // Close the database connection
    await cacheConnection.disconnect();
    await dbManager.close();
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    // Ensure that the application exits, even in the presence of errors
    process.exit();
  }
}

export default cleanupAndExit;
