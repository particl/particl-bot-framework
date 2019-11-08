import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Bot } from "./bot.entity";

@Entity({ name: 'bot_wallets' })
export class BotWallet {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string;

  @ManyToOne(type => Bot, bot => bot.wallets)
  bot: Bot;
}