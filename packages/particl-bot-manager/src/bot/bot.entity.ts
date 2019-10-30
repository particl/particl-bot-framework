
import { Entity, Column, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

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

  @OneToMany(type => BotWallet, wallet => wallet.bot)
  wallets: BotWallet[];
}

@Entity({ name: 'bot_wallets' })
export class BotWallet {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string;

  @ManyToOne(type => Bot, bot => bot.wallets)
  bot: Bot;
}