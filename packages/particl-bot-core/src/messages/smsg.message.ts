import { DiscoveryMessage } from './discovery.message';
import { CommandMessage } from './command.message';
import { ResponseMessage } from './response.message';

export type SupportedMessageTypes = DiscoveryMessage | CommandMessage | ResponseMessage;

export class SMSGMessage {
  
  public version: string;
  public type: string;
  public payload: SupportedMessageTypes;

  constructor(
    version: string,
    type: string,
    payload: SupportedMessageTypes
  ) {
    this.version = version;
    this.type = type;
    this.payload = payload;
  }
}