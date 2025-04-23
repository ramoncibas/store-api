import { cleanupAndExit } from 'utils';

/**
 * Sets up process listeners for graceful shutdown.
 * Listens for termination signals and ensures cleanup before exiting.
 */
function setupProcessListeners() {
  ['beforeExit', 'SIGINT', 'SIGTERM'].forEach(event => {
    process.on(event, cleanupAndExit);
  });
}


export default setupProcessListeners;