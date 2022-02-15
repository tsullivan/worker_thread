import { resourceLimits } from 'worker_threads';

// Give Node.js a chance to move the memory to the old generation region
const WAIT = 40;

const allocateMemory = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        new Array(resourceLimits.maxOldGenerationSizeMb! * 1024)
          .fill('')
          .map((_, idx) => idx) // more unique values prevent aggressive memory compression and hits mem limits faster
      );
    }, WAIT);
  });
}

(async function run() {
  const memoryLeak = [];
  for (;;) /* a computer crying */ {
    memoryLeak.push(await allocateMemory());
  }
})();
