import { ParticlBotBase, BotBaseConfig } from './bot_base';
import { SMSGMessage } from './messages/smsg.message';
import { MESSAGE_TYPES } from './types';

export type BotListenerConfig = {
  address: string;
} & BotBaseConfig;

export class ParticlBotListener extends ParticlBotBase {

  protected config: BotListenerConfig;

  public address: string;

  constructor(config: BotListenerConfig) {
    super(config);

    this.address = this.config.address;
  }

  public async start() {
    await super.start();
    
    const addLocalKey = await this.particlClient.methods.smsgAddLocalAddress(this.address);
    this.config.logger.info(addLocalKey);

    if (addLocalKey.result === 'Receiving messages enabled for address.') {
      await this.particlClient.methods.smsgScanBuckets();
    }

    const inbox = await this.particlClient.methods.smsgInbox('all', this.broadcastAddress);

    for (const msg of inbox.messages) {
      try {
        const message = JSON.parse(msg.text) as SMSGMessage;

        if (message.type === MESSAGE_TYPES.DISCOVERY) {
          this.processSMSGMessage(msg.msgid);
        }
      } catch (e) {}
      
    }

  }
}
