import type { ValidationError } from 'class-validator';
import { ErrorDetail } from './response-formatter';
import { ERROR_CONSTANTS } from '../constants/error-constant';

export function buildValidationDetails(
  errors: ValidationError[],
  parentPath = '',
): ErrorDetail[] {
  const out: ErrorDetail[] = [];

  for (const err of errors) {
    const path = parentPath ? `${parentPath}.${err.property}` : err.property;

    if (err.constraints) {
      const firstMsg = Object.values(err.constraints)[0];

      const m = path.match(/^details\.(\d+)\.(.+)$/);
      const detail: ErrorDetail = {
        field: m ? String(m[2]) : path.replace(/^header\./, ''),
        code: ERROR_CONSTANTS.VALIDATION_ERROR.code,
        message: typeof firstMsg === 'string' ? firstMsg : String(firstMsg),
        ...(m ? { id: String(Number(m[1]) + 1) } : {}),
      };
      out.push(detail);
    }

    if (err.children?.length) {
      out.push(...buildValidationDetails(err.children, path));
    }
  }

  return out;
}
