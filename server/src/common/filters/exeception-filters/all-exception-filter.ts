import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';

import { APIError, APIException } from '../../exception/api.exception';
import { ExceptionFormatter } from '../../exception/exception-formatter';
import { Prisma } from '@prisma/client';

@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost): any {
    //console.error(exception);

    const ctx = host.switchToHttp();
    const res: Response = ctx.getResponse<Response>();
    let error: APIError = {
      message: 'Something went wrong',
    };
    let status: HttpStatus = HttpStatus.OK;

    if (exception instanceof APIException) {
      error = ExceptionFormatter.formatAPIException(exception);
      status = exception.httpStatus;
    } else if (exception instanceof BadRequestException) {
      // validation error
      error = ExceptionFormatter.formatBadRequestException(exception);
      status = exception.getStatus();
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Prisma database error
      const ex = ExceptionFormatter.formatPrismaError(exception);
      error = { message: ex.message };
      status = ex.httpStatus;
    } else if (
      exception instanceof Prisma.PrismaClientUnknownRequestError ||
      exception instanceof Prisma.PrismaClientValidationError
    ) {
      error = { message: exception.message };
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    } else if (exception instanceof NotFoundException) {
      error = ExceptionFormatter.formatNotFoundException(exception);
      status = exception.getStatus();
    } else if (exception instanceof Error) {
      // unknown internal error
      error = ExceptionFormatter.formatUnknownError(exception);
    }

    res.status(status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);
  }
}
