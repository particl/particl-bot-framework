import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: 'bot_author' })
export class BotAuthor {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({nullable: true})
  name: string;

  @Column({nullable: true})
  email: string;

  @Column({type: 'simple-json', nullable: true})
  chat_ids: string[];
}