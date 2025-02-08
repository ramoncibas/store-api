import { cleanupAndExit } from 'utils';

function setupProcessListeners() {
  ['beforeExit', 'SIGINT', 'SIGTERM'].forEach(event => {
    process.on(event, cleanupAndExit);
  });
}


export default setupProcessListeners;