import { IParticlClientConfig } from 'particl-client';

import * as dotenv from 'dotenv';

dotenv.config({ path: `${process.env.NODE_ENV || 'development'}.env` });

const config: IParticlClientConfig = {
  network: process.env.NETWORK,
  host: process.env.RPC_HOSTNAME,
  port: process.env.RPC_PORT,
  username: process.env.RPC_USER,
  password: process.env.RPC_PASSWORD,
  wallet: process.env.WALLET,
}

export = config;
