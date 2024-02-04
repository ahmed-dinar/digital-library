import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { APIError, APIException } from './api.exception';
import { Prisma } from '@prisma/client';

const isProduction = process.env.NODE_ENV == 'production';

export class ExceptionFormatter {
  /**
   * Get formatted error response from our internal APIException
   *
   * @static
   * @param {APIException} exception
   * @return {*}  {APIError}
   * @memberof ExceptionFormatter
   */
  static formatAPIException(exception: APIException): APIError {
    return {
      message: exception.message,
      ...(exception.errors && { errors: exception.errors }),
      ...(!isProduction && { stack: exception.stack }),
    };
  }

  /**
   * Get formatted error response for validation error
   * Validation errors are normally thrown from the DTO
   *
   * @static
   * @param {BadRequestException} exception
   * @return {*}  {APIError}
   * @memberof ExceptionFormatter
   */
  static formatBadRequestException(exception: BadRequestException): APIError {
    const response = exception.getResponse() as {
      message: string;
      errors: string[];
    };

    // validation error
    if (response && response.errors && Array.isArray(response.errors)) {
      return {
        message: response.message,
        ...(response &&
          response.errors && {
            errors: response.errors.map((message: string) => ({ message })),
          }),
      };
    }

    // other bad request exception like invalid JSON input
    return {
      message: response.message,
    };
  }

  /**
   * Get formatted error response from not found exception
   * Normally this error is thrown by the nest, when an API endpoint is invalid
   *
   * @static
   * @param {NotFoundException} exception
   * @return {*}  {APIError}
   * @memberof ExceptionFormatter
   */
  static formatNotFoundException(exception: NotFoundException): APIError {
    const response = exception.getResponse() as {
      message: string;
    };

    return {
      message: response.message,
    };
  }

  /**
   * format and log unknown error those are not handled
   *
   * @static
   * @param {Error} exception
   * @return {*}  {APIError}
   * @memberof ExceptionFormatter
   */
  static formatUnknownError(exception: Error): APIError {
    return {
      message: 'Internal Server Error: ' + exception.message,
      ...(!isProduction && exception.stack && { stack: exception.stack }),
    };
  }

  /**
   * Format prisma errors
   * @param error
   */
  static formatPrismaError(
    error: Prisma.PrismaClientKnownRequestError,
  ): APIException {
    // Default values for status and message
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string;

    // Customize the response based on Prisma error codes
    switch (error.code) {
      case 'P2025': // Record not found
        status = HttpStatus.NOT_FOUND;
        message = `Record not found`;
        break;
      case 'P2002': // Record not found
        status = HttpStatus.BAD_REQUEST;
        message = `${error.meta?.modelName} already exists with given '${error.meta?.target}'`;
        break;
      case 'P2014':
        status = HttpStatus.BAD_REQUEST;
        message = `Invalid ID: ${error.meta?.target}`;
        break;
      case 'P2003':
        status = HttpStatus.BAD_REQUEST;
        message = `Invalid input data: ${error.meta?.target}`;
        break;
      default:
        message = error.message;
        break;
    }

    return new APIException(message, status);
  }
}
