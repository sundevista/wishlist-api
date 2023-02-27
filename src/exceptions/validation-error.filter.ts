import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import {TypeORMError} from "typeorm";

const formatExceptionMessageForUser = (exception: TypeORMError) => {
  return exception.name + exception.message;
}

@Catch(TypeORMError)
export class ValidationErrorFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = 400;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: formatExceptionMessageForUser(exception),
    });
  }
}
