/**
 * @param {unknown} err
 */
export function mySqlErrorHandler(err) {
  if (typeof err !== "object" || err === null) {
    return null;
  }

  const e = err;

  if (
    "code" in e &&
    "errno" in e &&
    "sqlMessage" in e &&
    "sql" in e &&
    "sqlState" in e
  ) {
    return {
      code: e.code,
      errno: e.errno,
      sql: e.sql,
      sqlState: e.sqlState,
      sqlMessage: e.sqlMessage,
    };
  }

  return null;
}
