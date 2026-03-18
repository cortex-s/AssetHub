/**
 * @template {import("express").RequestHandler} T
 * @param {T} fn
 * @returns {T}
 */
export const handler = (fn) => fn;
