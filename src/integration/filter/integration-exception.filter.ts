import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class IntegrationExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {}
}
