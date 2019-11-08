import { BotAuthor } from "../types";

export class DiscoveryMessage {
  
  public name: string;
  public description: string;
  public version: string;
  public address: string;
  public type: string;
  public author: BotAuthor | null;
  public image: string;

  constructor(
    name: string,
    description: string,
    version: string,
    address: string,
    type: string,
    author: BotAuthor | null,
    image: string
  ) {
    this.name = name;
    this.description = description;
    this.version = version;
    this.address = address;
    this.type = type;
    this.author = author;
    this.image = image;
  }
}