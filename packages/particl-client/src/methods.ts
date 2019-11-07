import { ParticlClient } from './particl-client';

export class Methods {
  private client: ParticlClient;

  constructor(client: ParticlClient) {
    this.client = client;
  }

  // Network
  public async getNetworkInfo() {
    return this.client.call('getnetworkinfo');
  }

  public async getNewAddress() {
    return this.client.call('getnewaddress');
  }

  // SMSG
  public async smsgImportPrivKey(privKey: string, label: string = '') {
    return this.client.call('smsgimportprivkey', [privKey, label]);
  }

  public async smsgAddAddress(address: string, pubKey: string) {
    return this.client.call('smsgaddaddress', [address, pubKey]);
  }

  public async smsgAddLocalAddress(address: string) {
    return this.client.call('smsgaddlocaladdress', [address]);
  }

  public async smsgScanBuckets() {
    return this.client.call('smsgscanbuckets');
  }

  public async smsgInbox(mode: 'all' | 'unread' | 'clear' = 'all', filter: string = '') {
    return this.client.call('smsginbox', [mode, filter]);
  }

  public async smsgSend(
    fromAddress: string,
    toAddress: string,
    message: string,
    paidMessage: boolean = true,
    daysRetention: number = 7,
    estimateFee: boolean = false,
  ) {
    const params: any[] = [fromAddress, toAddress, message, paidMessage, daysRetention, estimateFee];

    return await this.client.call('smsgsend', params);
  }

  public async smsg(msgId: string, remove: boolean = false, setRead: boolean = false) {
    return await this.client.call('smsg', [
      msgId,
      {
        delete: remove,
        encoding: 'text',
        setread: setRead,
      },
    ]);
  }
}
