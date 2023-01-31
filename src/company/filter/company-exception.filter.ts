import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import {CompanyException} from "../exception/company.exception";

@Catch(CompanyException)
export class CompanyExceptionFilter implements ExceptionFilter {
  catch(exception: CompanyException, host: ArgumentsHost) {
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
