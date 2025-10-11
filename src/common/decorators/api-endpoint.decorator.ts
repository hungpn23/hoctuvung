import { ErrorDto } from '@common/dtos/error.dto';
import { PaginatedDto } from '@common/dtos/offset-pagination/offset-pagination.dto';
import {
  applyDecorators,
  HttpCode,
  HttpStatus,
  SerializeOptions,
  Type,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { STATUS_CODES } from 'http';
import { ApiPublic } from './auth/api-public.decorator';

type EndpointOptions = {
  type: Type<unknown>;
  isPublic: boolean;
  description: string;
  statusCode: HttpStatus;
  errorStatusCodes: HttpStatus[];
  isPaginated: boolean;
};

type OptionalEndpointOptions = Partial<EndpointOptions>;

export function ApiEndpoint(options: OptionalEndpointOptions = {}) {
  const {
    type,
    isPublic,
    description = 'OK',
    statusCode = HttpStatus.OK,
    errorStatusCodes,
    isPaginated,
  } = options;

  const decorators: MethodDecorator[] = [];

  decorators.push(SerializeOptions({ type }));
  decorators.push(HttpCode(statusCode));
  decorators.push(isPublic ? ApiPublic() : ApiBearerAuth());

  if (type) {
    if (isPaginated) {
      decorators.push(ApiPaginatedResponse(type));
    } else {
      decorators.push(
        ApiOkResponse({
          type,
          description,
        }),
      );
    }
  }

  handleErrorResponse(errorStatusCodes, isPublic).forEach((statusCode) => {
    decorators.push(
      ApiResponse({
        type: ErrorDto,
        status: statusCode,
        description: STATUS_CODES[statusCode],
      }),
    );
  });

  return applyDecorators(...decorators);
}

export function ApiPublicEndpoint(
  options: Omit<OptionalEndpointOptions, 'isPublic'> = {},
) {
  return ApiEndpoint({ ...options, isPublic: true });
}

function handleErrorResponse(
  errorStatusCodes?: HttpStatus[],
  isPublic?: boolean,
) {
  const defaultErrorStatusCodes = [
    HttpStatus.BAD_REQUEST,
    HttpStatus.UNAUTHORIZED,
    HttpStatus.UNPROCESSABLE_ENTITY,
    HttpStatus.INTERNAL_SERVER_ERROR,
  ];

  if (errorStatusCodes) defaultErrorStatusCodes.push(...errorStatusCodes);

  const uniqueErrorStatusCodes = [...new Set(defaultErrorStatusCodes)];

  if (isPublic)
    return uniqueErrorStatusCodes.filter(
      (code) => code !== HttpStatus.UNAUTHORIZED,
    );

  return uniqueErrorStatusCodes;
}

function ApiPaginatedResponse<DataDto extends Type<unknown>>(
  dataDto: DataDto,
): MethodDecorator {
  // ref: https://aalonso.dev/blog/2021/how-to-generate-generics-dtos-with-nestjsswagger-422g
  return applyDecorators(
    ApiExtraModels(PaginatedDto, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            $ref: getSchemaPath(PaginatedDto),
          },
          {
            properties: {
              // override 'data' property of PaginatedDto
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  );
}
