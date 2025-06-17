import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { IANAZone } from 'luxon';

@ValidatorConstraint({ async: false })
export class IsIanaTimezoneConstraint implements ValidatorConstraintInterface {
  validate(zone: any): boolean {
    return typeof zone === 'string' && IANAZone.isValidZone(zone);
  }

  defaultMessage(): string {
    return 'La zona horaria ($value) no es un identificador IANA válido';
  }
}

export function IsIanaTimezone(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsIanaTimezoneConstraint,
    });
  };
}
