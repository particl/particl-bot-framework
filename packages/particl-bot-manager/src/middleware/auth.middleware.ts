
import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor() {} //private readonly config: ConfigService

  use(req: Request, res: Response, next: Function) {
    if (process.env.AUTH_DISABLED === 'true') {
      return next();
    }

    if (!req.headers.authorization) {
      throw new ForbiddenException();
    }

    const [type, encodedCredentials] = req.headers.authorization.split(' ');
    
    if (type !== 'Basic') {
      throw new ForbiddenException();
    }

    const credentials = Buffer.from(encodedCredentials, 'base64').toString();

    if (credentials !== `${process.env.BOT_USER}:${process.env.BOT_PASSWORD}`) {
      throw new ForbiddenException();
    }
    
    next();
  }
}