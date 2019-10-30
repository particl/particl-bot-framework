export class ResponseMessage {
  
  public id: string;
  public response: any;
  public error: string;

  constructor(
    id: string,
    response: any,
    error: string
  ) {
    this.id = id;
    this.response = response;
    this.error = error;
  }
}