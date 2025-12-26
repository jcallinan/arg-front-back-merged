import { OPEN_PAYABLES_TYPES } from '@src/shared/constants/constant';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';


@ValidatorConstraint({ async: false })
class ConditionalRequiredValidator implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const object = args.object as any;
    const openPayables = object.openPayables;

    if (
      [OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_VENDOR_DISCOUNTS, OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_VENDOR_AGED].includes(openPayables)
    ) {
      return object.dateOne && object.dateTwo && object.dateThree && object.dateFour;
    }

    if (openPayables === OPEN_PAYABLES_TYPES.OPEN_PAYABLES_IN_HOLD_STATUS) {
      return !!object.holdVoucher;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const object = args.object as any;
    const openPayables = object.openPayables;

    if (
      [OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_VENDOR_DISCOUNTS, OPEN_PAYABLES_TYPES.OPEN_PAYABLES_BY_VENDOR_AGED].includes(openPayables)
    ) {
      return `dateOne, dateTwo, dateThree, and dateFour are required when openPayables is ${openPayables}.`;
    }

    if (openPayables === OPEN_PAYABLES_TYPES.OPEN_PAYABLES_IN_HOLD_STATUS) {
      return `holdVoucher is required when openPayables is ${openPayables}.`;
    }

    return 'Invalid conditional fields';
  }
}

export function ConditionalRequired(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'conditionalRequired',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ConditionalRequiredValidator,
    });
  };
}
