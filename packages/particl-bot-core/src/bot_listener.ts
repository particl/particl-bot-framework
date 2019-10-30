import { ParticlBotBase, BotBaseConfig } from './bot_base';

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
    
    this.config.logger.info(await this.particlClient.methods.smsgAddLocalAddress(this.address));
  }
}
