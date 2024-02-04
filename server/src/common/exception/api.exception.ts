import { HttpException, HttpStatus } from '@nestjs/common';

export interface APIError {
  message: string;
  errors?: ErrorDetails[];
  stack?: string;
}

interface ErrorDetails {
  message: string;
}

export class APIException extends HttpException {
  public httpStatus: number;
  public errors: ErrorDetails[];

  constructor(message: string, httpStatus?: number, errors?: ErrorDetails[]) {
    // Calling parent constructor of base Exception class.
    super(message, httpStatus || HttpStatus.INTERNAL_SERVER_ERROR);

    this.name = APIException.name;
    this.httpStatus = httpStatus || HttpStatus.INTERNAL_SERVER_ERROR;
    this.errors = errors || [];
  }
}
