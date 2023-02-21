import {ArgumentsHost, Catch, ExceptionFilter} from "@nestjs/common";
import {Response} from 'express';
import {Error} from "mongoose";
import ValidationError = Error.ValidationError;
import { MongoServerError } from 'mongoose/node_modules/mongodb';

//TODO: make an error message prettifier to response a user with more simple and comprehensive information

@Catch(ValidationError, MongoServerError)
export class ValidationErrorFilter implements ExceptionFilter {
  catch(exception: ValidationError | MongoServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = 400;

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        message: exception.message,
      });
  }
}
