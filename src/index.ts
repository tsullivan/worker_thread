import * as path from 'path';
import { MessageChannel, MessagePort, Worker } from 'worker_threads';

export interface WorkerRequest {
  port: MessagePort;
  data: string;
}

export interface WorkerResponse {
  error?: string;
  data: string;
}

function hello(): Promise<string> {
  const { port1: myPort, port2: theirPort } = new MessageChannel();
  const workerPath = path.resolve(process.cwd(), 'dist', 'worker.js');
  const worker = new Worker(workerPath);

  return new Promise((resolve, reject) => {
    worker.on('error', (workerError) => {
      reject(workerError);
    });

    // Send the initial request
    const generatePdfRequest: WorkerRequest = {
      port: theirPort,
      data: `I was a teenage werewolf!`,
    };
    worker.postMessage(generatePdfRequest, [theirPort]);

    // Expect a message back from the worker
    myPort.on('message', ({ error, data }: WorkerResponse) => {
      if (error) {
        reject(error);
      }

      resolve(data);
      worker.terminate();
    });

  });
}

hello();
