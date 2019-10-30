export class DiscoveryMessage {
  
  public name: string;
  public description: string;
  public version: string;
  public address: string;
  public type: string;
  public image: string;

  constructor(
    name: string,
    description: string,
    version: string,
    address: string,
    type: string,
    image: string
  ) {
    this.name = name;
    this.description = description;
    this.version = version;
    this.address = address;
    this.type = type;
    this.image = image;
  }
}