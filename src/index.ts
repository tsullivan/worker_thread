import * as path from 'path';
import {
  MessageChannel,
  MessagePort,
  // ResourceLimits,
  Worker,
} from 'worker_threads';

export interface WorkerRequest {
  port: MessagePort;
  data: string;
}

export interface WorkerResponse {
  error?: string;
  data: string;
}

const { port1: myPort, port2: theirPort } = new MessageChannel();
const workerPath = path.resolve(process.cwd(), 'dist', 'worker.js');

// const resourceLimits: ResourceLimits = {};
const worker = new Worker(workerPath /*, { resourceLimits } */);

function hello(): Promise<string> {
  return new Promise((resolve, reject) => {
    worker.on('error', (workerError) => {
      reject(workerError);
    });

    // Send the initial request
    const generatePdfRequest: WorkerRequest = {
      port: theirPort,
      data: `This test is the best!`,
    };
    worker.postMessage(generatePdfRequest, [theirPort]);

    // Expect a message back from the worker
    myPort.on('message', ({ error, data }: WorkerResponse) => {
      if (error) {
        reject(error);
      }

      resolve(data);
    });
  });
}

Promise.resolve()
  .then(hello)
  .then(async message => {
    console.log(message);
  })
  .catch(error => {
    console.error(error);
  })
  .finally(async () => {
    worker.terminate();
  });

setInterval(() => {
  console.log(JSON.stringify(process.memoryUsage()));
}, 100);
