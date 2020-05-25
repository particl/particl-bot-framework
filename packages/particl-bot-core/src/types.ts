export type AuthorChat = {
  type: string;
  id: string;
}

export type BotAuthor = {
  name?: string,
  email?: string,
  chat_ids?: AuthorChat[]
}

export enum MESSAGE_TYPES {

  DISCOVERY = 'DISCOVERY',
  COMMAND = 'COMMAND',
  RESPONSE = 'RESPONSE',
  SIMPLE = 'SIMPLE',

}

export enum BOT_TYPES {

  EXCHANGE = 'EXCHANGE',
  RATE = 'RATE'

}

export enum COMMAND_TYPES {

  GET_SUPPORTED_CURRENCIES = 'GET_SUPPORTED_CURRENCIES',
  GET_OFFER = 'GET_OFFER',
  EXCHANGE = 'EXCHANGE',
  EXCHANGE_STATUS = 'EXCHANGE_STATUS'

}