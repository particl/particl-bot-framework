import { EventEmitter } from 'events';

import { DEFAULT_HOST, DEFAULT_NETWORK, DEFAULT_NETWORK_PORTS } from './defaults';
import { getDefaultDataDir, NOOPLogger } from './helpers';
import { Methods } from './methods';

import * as fs from 'fs';
import * as got from 'got';
import * as path from 'path';
import * as zmq from 'zeromq';

const packageJson = require('../package.json');

export interface IParticlClientConfig {
  host?: string;
  port?: string;
  network?: string;
  wallet?: string;
  username?: string;
  password?: string;
  dataDir?: string;
  userAgent?: string;
  zmq?: {
    zmqpubhashblock?: string;
    zmqpubhashblockhwm?: string;

    zmqpubhashtx?: string;
    zmqpubhashtxhwm?: string;

    zmqpubrawblock?: string;
    zmqpubrawblockhwm?: string;

    zmqpubrawtx?: string;
    zmqpubrawtxhwm?: string;

    zmqpubsmsg?: string;
    zmqpubsmsghwm?: string;

    whitelistzmq?: string | string[];
  };
  logger?: any;
}

export class ParticlClient extends EventEmitter {
  public methods: Methods;

  private config: IParticlClientConfig;

  private auth: string;
  private rpc: any;
  private zmq: any = {};

  constructor(config: IParticlClientConfig) {
    super();

    this.config = this.setDefaults(config);
  }

  public async connect() {
    if (!this.auth) {
      this.auth = await this.getCookie();
    }

    this.rpc = got.extend({
      auth: this.auth,
      baseUrl: `http://${this.config.host}`,
      headers: {
        'User-Agent': this.config.userAgent,
      },
      json: true,
      port: this.config.port,
    });

    // Connect ZMQ
    if (this.config.zmq) {
      for (const key in this.config.zmq) {
        if (this.config.zmq.hasOwnProperty(key) && key.match(/zmqpub\w+/)) {
          const address = this.config.zmq[key];

          if (!this.zmq.hasOwnProperty(address)) {
            this.zmq[address] = zmq.socket('sub');
            this.zmq[address].connect(address);

            this.zmq[address].on('message', (topic, message) => {
              this.emit(topic, message);
            });
          }

          this.zmq[address].subscribe(key.replace('zmqpub', ''));
        }
      }
    }

    await this.waitForConnection();
  }

  public async disconnect() {
    for (const address in this.zmq) {
      if (this.zmq.hasOwnProperty(address)) {
        this.zmq[address].disconnect();
      }
    }
  }

  public async call(method: string, params?: any[]) {
    const body = {
      id: 1,
      jsonrpc: '2.0',
      method: method,
      params: params,
    };

    return this.rpc
      .post(`/wallet/${this.config.wallet}`, {
        body,
      })
      .then((res: any) => res.body.result);
  }

  private setDefaults(config: IParticlClientConfig) {
    config.logger = config.logger || new NOOPLogger();
    config.network = config.network || DEFAULT_NETWORK;

    if (!DEFAULT_NETWORK_PORTS.hasOwnProperty(config.network)) {
      throw new Error(`Invalid network selected ${config.network}. ('testnet', 'mainnet')`);
    }

    config.dataDir = config.dataDir || getDefaultDataDir('Particl');
    config.host = config.host || DEFAULT_HOST;
    config.port = config.port || DEFAULT_NETWORK_PORTS[config.network];
    config.wallet = config.wallet || '';
    config.userAgent = config.userAgent || `Particl Client ${packageJson.version}`;

    if (config.username && config.password) {
      this.auth = `${config.username}:${config.password}`;
    }

    this.methods = new Methods(this);

    return config;
  }

  private async getCookie() {
    const network = this.config.network.replace('mainnet', '');
    const cookiePath = path.join(this.config.dataDir, network, '.cookie');

    let attempts = 0;
    while (attempts < 10) {
      try {
        return fs.readFileSync(cookiePath).toString('utf-8');
      } catch (e) {
        attempts++;
        this.config.logger.info(`Waiting for cookie file, is daemon running? (${attempts}/10).`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    throw new Error('No rpc credentials provided, and no cookie file was available.');
  }

  private async waitForConnection() {
    let attempts = 0;
    while (attempts < 24) {
      try {
        await this.methods.getNetworkInfo();
        return;
      } catch (e) {
        attempts++;
        this.config.logger.error(e.message);
        this.config.logger.info(`Waiting for daemon connection, is daemon running? (${attempts}/24).`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
}
