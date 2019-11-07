import { ParticlClient, IParticlClientConfig } from 'particl-client';
import { EventEmitter } from 'events';
import { MESSAGE_TYPES } from './types';
import { BROADCAST_KEYS, DEFAULT_NETWORK } from './defaults';

import { SMSGMessage, SupportedMessageTypes } from './messages/smsg.message';
import { CommandMessage } from './messages/command.message';
import { DiscoveryMessage } from './messages/discovery.message';
import { ResponseMessage } from './messages/response.message';

import * as particlBitcore from 'particl-bitcore-lib';

const packageInfo = require('../package.json');

class NOOPLogger {
  info(...args) {}
  error(...args) {}
  debug(...args) {}
}

export type BotBaseConfig = {
  network?: string;
  particlClient?: IParticlClientConfig;
  logger?: any
}

export class ParticlBotBase extends EventEmitter {

  protected config: BotBaseConfig;
  public particlClient: ParticlClient;

  public broadcastPrivKey: string;
  public broadcastPubKey: string;
  public broadcastAddress: string;

  address: string;

  constructor(config: BotBaseConfig) {
    super();

    this.config = this.setDefaults(config);

    this.broadcastPrivKey = BROADCAST_KEYS[this.config.network];
    const _privateKey = particlBitcore.PrivateKey(this.broadcastPrivKey);
    this.broadcastPubKey  = _privateKey.publicKey.toString();
    this.broadcastAddress = _privateKey.toAddress().toString();

    const particlConfig = {
      logger: this.config.logger,
      ...this.config.particlClient
    }

    particlConfig.network = this.config.network;
    
    this.particlClient = new ParticlClient(particlConfig);

    this.particlClient.on('smsg', (smsghash) => {
      const msgid = smsghash.slice(2).toString('hex');
      this.processSMSGMessage(msgid);
    });
  }

  private setDefaults(config: BotBaseConfig) {
    config.logger = config.logger || new NOOPLogger;
    config.network = config.network || DEFAULT_NETWORK

    return config;
  }

  public async start() {
    await this.particlClient.connect();
    
    await this.particlClient.methods.smsgImportPrivKey(this.broadcastPrivKey, 'Particl Bot Broadcast');
    this.config.logger.info(await this.particlClient.methods.smsgAddAddress(this.broadcastAddress, this.broadcastPubKey));
  }

  public async stop() {
    await this.particlClient.disconnect();
  }

  public async send(to: string, message: SupportedMessageTypes, daysRetention: number = 7){
    let type;
    switch (true) {
      case message instanceof DiscoveryMessage:
        type = MESSAGE_TYPES.DISCOVERY;
        break;

      case message instanceof CommandMessage:
        type = MESSAGE_TYPES.COMMAND;
        break;

      case message instanceof ResponseMessage:
        type = MESSAGE_TYPES.RESPONSE;
        break;

      default:
        throw new Error('Unsupported message type.');
    }

    const smsgMsg = new SMSGMessage(
      `${packageInfo.name}_${packageInfo.version}`,
      type,
      message
    );

    const serializedMessage = JSON.stringify(smsgMsg);

    return this.particlClient.methods.smsgSend(
      this.address,
      to,
      serializedMessage,
      false,
      daysRetention
    );
  }

  public async sendCommand(to: string, command: string, params: any[] = []) {
    return new Promise<any>(async (resolve, reject) => {
      const commandMsg = new CommandMessage(command, params);

      try {
        const result = await this.send(to, commandMsg, 1);

        if (result.msgid) {
          const timeout = setTimeout(()=> {
            this.removeListener(result.msgid, resolve);
            reject(new Error('Request timed out.'));
          }, 300000); // 5 mins

          this.once(result.msgid, (result)=> {
            clearTimeout(timeout);
            resolve(result);
          });
          
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public async broadcast(message: DiscoveryMessage) {
    this.send(this.broadcastAddress, message);
  }

  protected async processSMSGMessage(msgid: string) {
    const SMSGMessageResponse = await this.particlClient.methods.smsg(msgid);
    if (SMSGMessageResponse.from !== this.address) {
      try {
        const message = JSON.parse(SMSGMessageResponse.text) as SMSGMessage;
        let remove = true;
        if (message.version.startsWith(`${packageInfo.name}_`)) {
          switch (message.type) {
            case MESSAGE_TYPES.DISCOVERY:
              if (SMSGMessageResponse.from === message.payload['address']) {
                remove = false;
                this.emit(message.type, message.payload);
              }
              break;

            case MESSAGE_TYPES.COMMAND:
              const response = new ResponseBuilder(msgid, SMSGMessageResponse.from, this);
              this.emit(message.payload['command'], message.payload['params'], response);
              break;

            case MESSAGE_TYPES.RESPONSE:
              this.emit(message.payload['id'], {data: message.payload['response'], error: message.payload['error']});
              break;
          }

          await this.particlClient.methods.smsg(msgid, remove, true);
        }
      } catch (e) {}
    }
  }  
}

class ResponseBuilder {

  constructor(
    private readonly id: string,
    private readonly from: string,
    private readonly _bot: ParticlBotBase
  ) {}

  send(data: any) {
    const msg = new ResponseMessage(this.id, data, null);
    this._bot.send(this.from, msg);
  }

  error(error: string) {
    const msg = new ResponseMessage(this.id, null, error);
    this._bot.send(this.from, msg);
  }
}