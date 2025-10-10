import { ErrorDetailDto, ErrorDto } from '@common/dtos/error.dto';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  UnprocessableEntityException,
  ValidationError,
} from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    let error: ErrorDto;

    if (exception instanceof UnprocessableEntityException) {
      // this exception is thrown from main.ts (ValidationPipe)
      error = this.handleUnprocessableEntityException(exception);
    } else if (exception instanceof HttpException) {
      error = this.handleHttpException(exception);
    } else {
      error = this.handleError(exception);
    }

    response.status(error.statusCode).json(error);
  }

  private handleUnprocessableEntityException(
    exception: UnprocessableEntityException,
  ) {
    const response = exception.getResponse() as { message: ValidationError[] };
    const statusCode = exception.getStatus();

    const errorResponse = {
      timestamp: new Date().toISOString(),
      statusCode,
      message: 'Validation failed',
      details: this.handleValidationErrors(response.message),
    };

    return errorResponse as ErrorDto;
  }

  private handleHttpException(exception: HttpException) {
    return {
      timestamp: new Date().toISOString(),
      statusCode: exception.getStatus(),
      message: exception.message,
    } as ErrorDto;
  }

  private handleError(error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));

    return {
      timestamp: new Date().toISOString(),
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: err.message || HttpErrorByCode[HttpStatus.INTERNAL_SERVER_ERROR],
    } as ErrorDto;
  }

  // ref: https://www.yasint.dev/flatten-error-constraints
  private handleValidationErrors(errors: ValidationError[]) {
    const results: ErrorDetailDto[] = [];
    for (const error of errors) {
      this.flattenError(error, results);
    }
    return results;
  }

  private flattenError(
    error: ValidationError,
    results: ErrorDetailDto[],
    parentPath?: string,
  ) {
    const propertyPath = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;

    if (error.constraints) {
      for (const [constraintName, message] of Object.entries(
        error.constraints,
      )) {
        results.push({
          property: propertyPath,
          constraintName,
          message,
        });
      }
    }

    if (error.children && error.children.length > 0) {
      for (const child of error.children) {
        this.flattenError(child, results, propertyPath);
      }
    }
  }
}
