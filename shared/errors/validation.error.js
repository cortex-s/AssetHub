import { ERROR_LIST } from "./list.js";

export class ValidationError extends Error {
  /**
   * @param {import("../types/fieldErrors.js").FieldErrors} fieldErrors
   */
  constructor(fieldErrors) {
    super(ERROR_LIST.VALIDATION_ERROR.message);
    this.code = ERROR_LIST.VALIDATION_ERROR.code;
    this.fieldErrors = fieldErrors;
  }
}
