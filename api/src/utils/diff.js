/**
 * @template T
 * @typedef {{type: string, path: (keyof T)[], val?: any}} OdiffResult
 */

/**
 * Extract changed fields from odiff result and prepare SQL UPDATE
 * @template T
 * @param {OdiffResult<T>[]} diffList
 * @returns {{ setClause: string, values: any[] }}
 */
export function buildUpdateFromDiff(diffList) {
  /** @type {Partial<any>} */
  const updateFields = {};

  diffList.forEach((diffItem) => {
    if (diffItem.type === "set") {
      const key = diffItem.path[0];
      updateFields[key] = diffItem.val;
    }
  });

  const keys = Object.keys(updateFields);
  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  const values = Object.values(updateFields);

  return { setClause, values };
}
