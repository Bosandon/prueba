import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ErrorHandlerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      next();
    } catch (error) {
      if (error instanceof HttpException) {
        const status = error.getStatus();
        const response = {
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: req.url,
          message: error.message,
        };
        res.status(status).json(response);
      } else {
        const status = HttpStatus.INTERNAL_SERVER_ERROR;
        const response = {
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: req.url,
          message: 'Internal server error',
        };
        res.status(status).json(response);
      }
    }
  }
}