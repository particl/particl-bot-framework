import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';

let proc: ChildProcess;

/**
 * Spawns the application in a seperate process
 */
exports.start = (envArgs: any) => {
  const p = path.join(__dirname, 'main');
  const environment = {
    APPDATA: process.env.APPDATA,
    ELECTRON_RUN_AS_NODE: true
  };

  const envActual = {...environment, ...envArgs};
  proc = spawn(process.execPath, [p], { env: envActual });
  return proc;
};

/**
 * Stops the process.
 */
exports.stop = () => {
  if (proc) {
    proc.kill('SIGINT');
  }
};
