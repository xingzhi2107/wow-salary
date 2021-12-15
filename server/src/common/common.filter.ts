import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { OPException } from './common.error';

@Catch(OPException)
export class OPExceptionFilter implements ExceptionFilter {
  catch(exception: OPException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const result = {
      errcode: exception.errcode,
      errmsg: exception.message,
    };

    response.status(HttpStatus.OK).json(result);
  }
}
