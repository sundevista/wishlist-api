import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import {
  EntityPropertyNotFoundError,
  QueryFailedError,
  TypeORMError,
} from 'typeorm';
import { propertyAndValueExtractorFromDuplicateMessage } from './exceptions.constants';

const formatExceptionMessageForUser = (exception: TypeORMError) => {
  if (
    exception instanceof QueryFailedError &&
    exception.message.includes('duplicate key')
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, prop, value] = exception.driverError.detail.match(
      propertyAndValueExtractorFromDuplicateMessage,
    );
    return `${prop} '${value}' is already taken, try choose another one`;
  } else if (exception instanceof EntityPropertyNotFoundError) {
    return 'Wrong schema, check scheme you sent';
  }

  return `Unexpected error: ${exception.name}`;
};

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
