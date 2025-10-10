import { applyDecorators } from '@nestjs/common';
import { ClassConstructor, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { ToBoolean, ToLowerCase, ToUpperCase } from './transforms.decorator';

type CommonOptions = {
  required?: boolean;
  each?: boolean; // if prop is an array --> validate each item in array
};

type NumberOptions = CommonOptions & {
  isInt?: boolean;
  isPositive?: boolean;
  minimum?: number;
  maximum?: number;
};

type StringOptions = CommonOptions & {
  minLength?: number;
  maxLength?: number;
  toLowerCase?: boolean;
  toUpperCase?: boolean;
};

type UrlOptions = CommonOptions & {
  require_tld?: boolean;
};

// **********************
// String-like validators
// **********************
export function StringValidator(
  options: StringOptions = {},
): PropertyDecorator {
  const { each, minLength, maxLength, toLowerCase, toUpperCase } = options;
  let decorators = [Type(() => String), IsString({ each })];

  decorators = handleCommonOptions(decorators, options);

  if (minLength) {
    decorators.push(MinLength(minLength, { each }));
  }
  if (maxLength) decorators.push(MaxLength(maxLength, { each }));
  if (toLowerCase) decorators.push(ToLowerCase());
  if (toUpperCase) decorators.push(ToUpperCase());

  return applyDecorators(...decorators);
}

export function OptionalStringValidator(
  options: Omit<StringOptions, 'required'> = {},
) {
  return StringValidator({ ...options, required: false });
}

export function EmailValidator(options: StringOptions = {}): PropertyDecorator {
  const decorators = [
    IsEmail(),
    StringValidator({ ...options, toLowerCase: true }),
  ];

  return applyDecorators(...decorators);
}

export function UrlValidator(options: UrlOptions = {}): PropertyDecorator {
  const { each, require_tld } = options;
  let decorators = [
    Type(() => String),
    IsString({ each }),
    IsUrl({ require_tld }, { each }),
  ];

  decorators = handleCommonOptions(decorators, options);

  return applyDecorators(...decorators);
}

export function PasswordValidator(
  options: StringOptions = {},
): PropertyDecorator {
  let decorators = [Type(() => String), IsString(), IsPassword()];

  decorators = handleCommonOptions(decorators, options);

  return applyDecorators(...decorators);
}

// **********************
// Number-like validators
// **********************
export function NumberValidator(
  options: NumberOptions = {},
): PropertyDecorator {
  const { each, isInt, isPositive, minimum, maximum } = options;
  let decorators = [Type(() => Number)];

  decorators = handleCommonOptions(decorators, options);

  if (isInt) {
    decorators.push(IsInt({ each }));
  } else {
    decorators.push(IsNumber({}, { each }));
  }

  if (minimum || minimum === 0) decorators.push(Min(minimum, { each }));
  if (maximum || maximum === 0) decorators.push(Max(maximum, { each }));
  if (isPositive) decorators.push(IsPositive({ each }));

  return applyDecorators(...decorators);
}

export function NumberValidatorOptional(
  options: Omit<NumberOptions, 'required'> = {},
) {
  return NumberValidator({ ...options, required: false });
}

export function PortValidator(): PropertyDecorator {
  return NumberValidator({ isInt: true, minimum: 1, maximum: 65535 });
}

// ****************
// Other validators
// ****************
export function BooleanValidator(
  options: CommonOptions = {},
): PropertyDecorator {
  let decorators = [ToBoolean(), IsBoolean({ each: options.each })];

  decorators = handleCommonOptions(decorators, options);

  return applyDecorators(...decorators);
}

export function EnumValidator<T extends Record<string, unknown>>(
  entity: T,
  options: CommonOptions = {},
): PropertyDecorator {
  let decorators = [IsEnum(entity, { each: options.each })];

  decorators = handleCommonOptions(decorators, options);

  return applyDecorators(...decorators);
}

export function ClassValidator<ClassName>(
  className: ClassConstructor<ClassName>,
  options: CommonOptions = {},
): PropertyDecorator {
  let decorators = [
    Type(() => className),
    ValidateNested({ each: options.each }),
  ];

  decorators = handleCommonOptions(decorators, options);

  return applyDecorators(...decorators);
}

// *******
// Helpers
// *******
function IsPassword(options?: ValidationOptions): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    registerDecorator({
      propertyName: propertyKey as string,
      name: 'IsPassword',
      target: target.constructor,
      options,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string') return false;
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#$%&*@^]).{8,}$/.test(
            value,
          );
        },
        defaultMessage() {
          return `$property must contain at least 8 characters, including uppercase, lowercase, number, and special character`;
        },
      },
    });
  };
}

function handleCommonOptions(
  decorators: PropertyDecorator[],
  options: CommonOptions = {},
) {
  const { required, each } = options;
  if (required === false) {
    decorators.push(IsOptional({ each }));
  } else {
    decorators.push(IsDefined({ each }));
  }

  return decorators;
}
