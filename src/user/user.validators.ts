import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function Exclude(
  exclude: string[],
  options?: {
    method?: 'every' | 'some';
    caseSensitive?: boolean;
  },
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'Exclude',
      target: object.constructor,
      propertyName,
      constraints: [exclude, options],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [exclude, { method, caseSensitive }] = args.constraints;
          const text = caseSensitive ? value : value.toLowerCase();
          if (
            exclude &&
            exclude[method || 'every']((val) =>
              text.includes(caseSensitive ? val : '' + val.toLowerCase()),
            )
          ) {
            return false;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must not contain ${args.constraints[1].method === 'some' ? 'any of' : ''} ${args.constraints[0]}.`;
        },
      },
    });
  };
}

export function Include(
  include: string[],
  options?: {
    method?: 'every' | 'some';
    caseSensitive?: boolean;
  },
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'Include',
      target: object.constructor,
      propertyName,
      constraints: [include, options],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [include, { method, caseSensitive }] = args.constraints;
          const text = caseSensitive ? value : value.toLowerCase();
          if (
            include &&
            include[method || 'every'](
              (val) =>
                !text.includes(caseSensitive ? val : '' + val.toLowerCase()),
            )
          ) {
            return true;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must contain must contain ${args.constraints[1].method === 'some' ? 'any of' : ''} ${args.constraints[0]}.`;
        },
      },
    });
  };
}

export function ValueMatches(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'ValueMatches',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (value !== args.object[args.constraints[0]]) {
            return false;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} and ${args.constraints[0]} must match.`;
        },
      },
    });
  };
}
