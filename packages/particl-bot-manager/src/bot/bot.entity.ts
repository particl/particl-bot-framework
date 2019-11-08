
import { Entity, Column, OneToMany, JoinTable, OneToOne, JoinColumn } from 'typeorm';
import { BotWallet } from './bot_wallet.entity';
import { BotAuthor } from './bot_author.entity';

@Entity({ name: 'bots' })
export class Bot {
  
  @Column({
    unique: true,
    primary: true
  })
  address: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  version: string;

  @Column()
  type: string;

  @Column()
  image: string;

  @OneToOne(type => BotAuthor, { cascade: true, eager: true })
  @JoinColumn()
  author: BotAuthor;

  @OneToMany(type => BotWallet, wallet => wallet.bot)
  wallets: BotWallet[];
}
