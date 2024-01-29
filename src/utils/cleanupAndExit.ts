import DatabaseManager from "../database/db";
import { cleanupTempFiles } from "utils";

/**
 * Cleans up resources and gracefully exits the application.
 * This function is typically used as a cleanup handler for
 * signals like 'beforeExit', 'SIGINT', and 'SIGTERM'.
 */
async function cleanupAndExit() {
  const dbManager = new DatabaseManager();
  console.log(`Received signal. Cleaning up and exiting...`);

  try {
    // Clean up temporary files
    cleanupTempFiles();

    // Close the database connection
    await dbManager.close();
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    // Ensure that the application exits, even in the presence of errors
    process.exit();
  }
}

export default cleanupAndExit;
