import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsPassword(
  options: {
    exclude?: string[];
    include?: string[];
    includeMethod?: 'every' | 'some';
  },
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsPassword',
      target: object.constructor,
      propertyName,
      constraints: [options],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const { exclude, include, includeMethod } = args.constraints[0];
          const lowercase = value.toLowerCase();
          if (exclude && exclude.some((val) => lowercase.includes(val))) {
            return false;
          }
          if (
            include &&
            include[includeMethod || 'every']((val) => !lowercase.includes(val))
          ) {
            return true;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `Password must contain a special character and must not contain ${args.constraints[0].exclude}.`;
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
      name: 'IsPassword',
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
          return `Passwords must match.`;
        },
      },
    });
  };
}
