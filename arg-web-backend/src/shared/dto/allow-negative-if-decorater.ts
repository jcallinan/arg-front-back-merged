import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
  } from "class-validator";
  
  export function NoPositiveIfNegative<T>(
    relatedProperty: keyof T,
    validationOptions?: ValidationOptions,
  ) {
    return function (object: object, propertyName: string) {
      registerDecorator({
        name: 'NoPositiveIfNegative',
        target: object.constructor as Function,
        propertyName,
        options: validationOptions,
        constraints: [relatedProperty],
        validator: {
          validate(value: any, args: ValidationArguments) {
            const obj = args.object as any;
            const relatedField = args.constraints[0];
            const relatedValue = obj[relatedField];
  
            // Rule:
            // If lineAmount < 0 AND discountAmount > 0 → INVALID
            if (relatedValue < 0 && value > 0) {
              return false;
            }
  
            return true;
          },
          defaultMessage(args: ValidationArguments) {
            const [relatedField] = args.constraints;
            return `${args.property} cannot be positive when ${relatedField} is negative.`;
          },
        },
      });
    };
  }
  
  