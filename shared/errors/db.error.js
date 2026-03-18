/**
 * @typedef {Object} DbField
 * @property {string} table
 * @property {string} column
 */
export class DatabaseError extends Error {
  /**
   * @param {{
   *  message?: string,
   *  code?: string,
   *  statusCode?: number,
   *  field?: DbField | null,
   *  original?: any
   * }} options
   */
  constructor({
    message = "Database error",
    code = "DB_ERROR",
    statusCode = 500,
    field = null,
    original = null,
  }) {
    super(message);
    this.name = "DatabaseError";
    this.code = code;
    this.statusCode = statusCode;
    this.field = field;
    this.original = original;
  }
}
