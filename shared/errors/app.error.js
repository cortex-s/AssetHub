export class AppError extends Error {
  /**
   * @param {string} message
   */
  constructor(message, code = "INTERNAL_ERROR", statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
  }
}
