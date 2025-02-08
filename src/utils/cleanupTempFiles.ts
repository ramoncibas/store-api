import fs from 'fs/promises'
import path from 'path';
import { reset, red, yellow } from 'app/common/colors';

const TEMP_DIR = 'temp';
const TEMP_FILE_PREFIX = 'tmp-1';
const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000; // Interval of  24 hours

/**
 * Cleans up temporary files in the specified directory and sets up periodic cleanup.
 */
async function cleanupTempFiles() {
  async function performCleanup() {
    try {
      const files = await fs.readdir(TEMP_DIR);
      const tempFiles = files.filter((file: string) => file.startsWith(TEMP_FILE_PREFIX));

      await Promise.all(tempFiles.map((file: any) => fs.unlink(path.join(TEMP_DIR, file))));
    
        console.log(`${yellow}🗑️  Temporary files successfully removed.${reset}`);

    } catch (error: any) {
      console.error(`${red}❌  Error removing temporary files:${reset} ${error.message}`);
    }
  }

  // Perform initial cleanup
  await performCleanup();

  // Set up periodic cleanup
  setInterval(performCleanup, CLEANUP_INTERVAL_MS);
}

export default cleanupTempFiles;
