import {ConnectionOptions} from 'typeorm';

import * as os from 'os';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: `${process.env.NODE_ENV || 'development'}.env` });

const config: ConnectionOptions = {
  type: 'sqlite',
  database: getDatabaseFile(),
  entities: [__dirname + '/**/*.entity{.ts,.js}'],

  // We are using migrations, synchronize should be set to false.
  synchronize: false,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: true,

  // allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

function getDatabasePath(): string {
  return path.join(getDefaultDataDirPath(), 'database');
}

function getDatabaseFile(): string {
  const databaseFile = path.join(getDatabasePath(), 'bot.db');
  return databaseFile;
}

function getDefaultDataDirPath(): string {

  const homeDir: string = os.homedir ? os.homedir() : process.env['HOME'];

  let dir = '';
  const appName = 'particl-bot';

  switch (process.platform) {
      case 'linux': {
          dir = path.join(homeDir, '.' + appName);
          break;
      }

      case 'darwin': {
          dir = path.join(homeDir, 'Library', 'Application Support', appName);
          break;
      }

      case 'win32': {
          dir = path.join(process.env['APPDATA'], appName);
          break;
      }
  }

  const dataDir = path.join(dir, process.env.NETWORK.replace('mainnet', ''));
  return dataDir;
}

export = config;
