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
      error = this._handleUnprocessableEntityException(exception);
    } else if (exception instanceof HttpException) {
      error = this._handleHttpException(exception);
    } else {
      error = this._handleError(exception);
    }

    response.status(error.statusCode).json(error);
  }

  private _handleUnprocessableEntityException(
    exception: UnprocessableEntityException,
  ) {
    const response = exception.getResponse() as { message: ValidationError[] };
    const statusCode = exception.getStatus();

    const errorResponse = {
      timestamp: new Date().toISOString(),
      statusCode,
      message: 'Validation failed',
      details: this._handleValidationErrors(response.message),
    };

    return errorResponse as ErrorDto;
  }

  private _handleHttpException(exception: HttpException) {
    return {
      timestamp: new Date().toISOString(),
      statusCode: exception.getStatus(),
      message: exception.message,
    } as ErrorDto;
  }

  private _handleError(error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));

    return {
      timestamp: new Date().toISOString(),
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: err.message || HttpErrorByCode[HttpStatus.INTERNAL_SERVER_ERROR],
    } as ErrorDto;
  }

  // ref: https://www.yasint.dev/flatten-error-constraints
  private _handleValidationErrors(errors: ValidationError[]) {
    const results: ErrorDetailDto[] = [];
    for (const error of errors) {
      this._flattenError(error, results);
    }
    return results;
  }

  private _flattenError(
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
        this._flattenError(child, results, propertyPath);
      }
    }
  }
}
