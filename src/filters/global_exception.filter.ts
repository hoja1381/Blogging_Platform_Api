import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalException implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      return res.status(status).json({
        statusCode: status,
        data: exception.getResponse(),
        date: new Date().toISOString,
        path: req.path,
      });
    }

    res.status(500).json({
      statusCode: 500,
      date: new Date().toLocaleDateString(),
      massage: 'Internal server err',
      data: exception.massage,
      path: req.path,
    });
  }
}
