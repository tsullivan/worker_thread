import { parentPort, isMainThread } from 'worker_threads';
import { WorkerRequest } from '.';

if (!isMainThread) {
  parentPort!.on('message', doWork);
}

export function doWork({ data, port }: WorkerRequest): void {
  console.log(`message in worker: ${data}`);
  port.postMessage(`your message back from the worker: ${data}`);
}
