import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import {UserException} from "../exception/user.exception";

@Catch()
export class UserExceptionFilter implements ExceptionFilter {
  catch(exception: UserException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();

      response
          .status(500)
          .json({
              timestamp: new Date().toISOString(),
              msg: exception.what(),
          });
  }
}
