Simple project to test worker thread and growing memory size
============================================================

Steps to run this project.

1. Run `npm install`
2. `npm run build`
3. `docker build . -t worker_threads` or give it whatever name you want
4. `docker run -it --memory=1gb --memory-swap=2gb --mount type=bind,source=$(pwd)/dist,target=//usr/src/app/dist worker_threads`
5. Inside Docker container: `node ./index.js`

You should reliably see the following:

```
Error [ERR_WORKER_OUT_OF_MEMORY]: Worker terminated due to reaching memory limit: JS heap out of memory
    at new NodeError (node:internal/errors:371:5)
    at Worker.[kOnExit] (node:internal/worker:276:26)
    at Worker.<computed>.onexit (node:internal/worker:198:20) {
  code: 'ERR_WORKER_OUT_OF_MEMORY'
}
i am the parent and i am OK
```
