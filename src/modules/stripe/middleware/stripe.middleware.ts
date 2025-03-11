import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class StripeWebhookMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.originalUrl === 'stripe/webhook') {
      req['rawBody'] = req.body;
      req.body = null;
    }
    next();
  }
}
