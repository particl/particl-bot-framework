import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletAddress } from './wallet_address.entity';
import { Repository } from 'typeorm';
import { ParticlClient } from 'particl-client';

import * as particlconfig from '../particlconfig';

@Injectable()
export class WalletAddressService {
  constructor(
    @InjectRepository(WalletAddress)
    private readonly repo: Repository<WalletAddress>,
  ) {}

  async get(wallet: string) {
    const options = {
      where: {
        wallet: wallet || '__DEFAULT_WALLET'
      }
    };

    const walletAddress = await this.repo.findOne(options);

    if (!walletAddress) {
      const particlClient = new ParticlClient(particlconfig);

      await particlClient.connect();

      const address = await particlClient.methods.getNewAddress();

      const walletAddress = {
        wallet: wallet || '__DEFAULT_WALLET',
        address
      }

      await this.repo.save(walletAddress);

      return walletAddress;
    }

    return walletAddress;
  }
}