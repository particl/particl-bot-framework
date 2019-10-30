import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export function getDefaultDataDir(appName: string) {
  const homeDir: string = os.homedir ? os.homedir() : process.env.HOME;

  let dir = '';

  switch (process.platform) {
    case 'linux': {
      dir = path.join(homeDir, '.' + appName.toLowerCase());
      break;
    }

    case 'darwin': {
      dir = path.join(homeDir, 'Library', 'Application Support', appName);
      break;
    }

    case 'win32': {
      const temp = path.join(process.env.APPDATA, appName);
      if (checkIfExists(temp)) {
        dir = temp;
      } else {
        dir = path.join(homeDir, 'AppData', 'Roaming', appName);
      }
      break;
    }
  }

  return dir;
}

function checkIfExists(dir: string): boolean {
  try {
    fs.accessSync(dir, fs.constants.R_OK);
    return true;
  } catch (err) {
    // Silence error
  }
  return false;
}

export class NOOPLogger {
  public info(...args) {
    /* NOOP */
  }
  public error(...args) {
    /* NOOP */
  }
  public debug(...args) {
    /* NOOP */
  }
}
