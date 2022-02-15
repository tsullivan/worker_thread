import * as path from 'path';
import {
  MessageChannel,
  MessagePort,
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

const worker = new Worker('./worker.js', {
  resourceLimits: { maxOldGenerationSizeMb: 16 },
});

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
  .then(message => {
    console.log(message);
  })
  .catch(error => {
    console.error(error);
  })
  .then(() => {
    console.log('i am the parent and i am OK')
  })
  .finally(() => {
    worker.terminate();
  });
