
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletAddressService } from './wallet_address.service';
import { WalletAddress } from './wallet_address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WalletAddress])],
  exports: [TypeOrmModule, WalletAddressService],
  providers: [WalletAddressService]
})
export class WalletAddressModule {}