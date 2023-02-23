import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { MongoServerError } from 'mongoose/node_modules/mongodb';
import {propertyAndValueExtractorFromDuplicateMessage} from "../constants/regexp";

const formatExceptionMessageForUser = (exception: MongoServerError) => {
  if (exception.code === 11000) {
    const [_, prop, value] = exception.message.match(propertyAndValueExtractorFromDuplicateMessage);
    return `${prop} '${value}' is already taken, try choose another one`;
  }

  return exception.message;
}

@Catch(MongoServerError)
export class ValidationErrorFilter implements ExceptionFilter {
  catch(exception: MongoServerError, host: ArgumentsHost) {
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
