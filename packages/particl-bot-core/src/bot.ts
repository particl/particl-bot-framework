import { ParticlBotBase, BotBaseConfig } from './bot_base';
import { DiscoveryMessage } from './messages/discovery.message';
import { BOT_TYPES } from './types';

import * as fs from 'fs';
import * as path from 'path';
import * as particlBitcore from 'particl-bitcore-lib';

export type BotConfig = {
  name: string;
  description: string;
  version: string;
  privKeys: {
    testnet?: string,
    mainnet?: string
  };
  type: BOT_TYPES;
} & BotBaseConfig;

export class ParticlBot extends ParticlBotBase {

  protected config: BotConfig;
  private discoveryMessageInterval;

  public privKey: string;
  public pubKey: string;
  public address: string;

  constructor(config: BotConfig) {
    super(config);

    try {
      this.privKey = this.config.privKeys[this.config.network];
    } catch (e) {
      throw new Error(`Provate key not available for network ${this.config.network}`);
    }
    
    const _privateKey = particlBitcore.PrivateKey(this.privKey);
    this.pubKey  = _privateKey.publicKey.toString();
    this.address = _privateKey.toAddress().toString();
  }

  public async start() {
    await super.start();

    await this.particlClient.methods.smsgImportPrivKey(this.privKey, 'Particl Bot');
    this.config.logger.info(await this.particlClient.methods.smsgAddAddress(this.address, this.pubKey));

    this.discoveryMessageInterval = await this.checkDiscoveryMessage();
  }

  public async stop() {
    super.stop();

    if (this.discoveryMessageInterval) {
      clearInterval(this.discoveryMessageInterval);
    }
  }

  private checkDiscoveryMessage() {
    const lastCheckedPath = path.join(process.cwd(), '.discovery');
    let lastChecked = 0;

    if (fs.existsSync(lastCheckedPath)) {
      try {
        lastChecked = parseInt(fs.readFileSync(lastCheckedPath).toString());
      } catch (e) {}
    }

    // Last sent more than 7 days ago
    if ((new Date().getTime() - lastChecked) >= 604800000) {
      const discoveryMessage = new DiscoveryMessage (
        this.config.name,
        this.config.description,
        this.config.version,
        this.address,
        this.config.type,
        this.getBotIcon()
      );

      this.broadcast(discoveryMessage);

      fs.writeFileSync(lastCheckedPath, new Date().getTime().toString());
    }

    if (!this.discoveryMessageInterval) {
      // recheck every hour
      this.discoveryMessageInterval = setInterval(() => this.checkDiscoveryMessage(), 3600000);
    }
  }

  private getBotIcon(): string {
    const botIndex = process.argv[1].split(path.sep);
    botIndex.pop();
    botIndex.push('icon.png');

    const iconPath = botIndex.join(path.sep);

    let imageBuffer;
    if (fs.existsSync(iconPath)) {
      imageBuffer = fs.readFileSync(iconPath);
    } else {
      imageBuffer = fs.readFileSync(path.join(__dirname, 'icon.png'));
    }

    return `data:image/png;base64,${imageBuffer.toString('base64')}`;
  }
  
}