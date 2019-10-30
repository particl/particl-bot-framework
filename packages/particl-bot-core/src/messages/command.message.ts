export class CommandMessage {
  
  public command: string;
  public params: any[];

  constructor(
    command: string,
    params?: any[]
  ) {
    this.command = command;
    this.params = params;
  }
}