
import { Entity, Column } from 'typeorm';

@Entity({ name: 'wallet_addresses' })
export class WalletAddress {
  
  @Column({
    unique: true,
    primary: true
  })
  wallet: string;

  @Column('text')
  address: string;
}