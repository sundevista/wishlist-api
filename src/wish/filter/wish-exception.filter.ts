import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import {WishException} from "../exception/wish.exception";

@Catch()
export class WishExceptionFilter<T> implements ExceptionFilter {
  catch(exception: WishException, host: ArgumentsHost) {
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
