
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Bot } from '../bot/bot.entity';

@Entity({ name: 'exchanges' })
export class Exchange {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  track_id: string;

  @Column()
  currency_from: string;

  @Column()
  currency_to: string;

  @Column()
  amount_from: string;

  @Column()
  amount_to: string;

  @Column()
  address_from: string;

  @Column()
  address_to: string;

  @Column()
  status: string;

  @Column()
  tx_from: string;

  @Column()
  tx_to: string;

  @Column()
  wallet: string;

  @ManyToOne(type => Bot)
  bot: Bot;
}