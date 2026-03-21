/**
 * @typedef {object} OFFICE_ROUTES
 * @property {string} id
 * @property {string} label
 * @property {string} href
 * @property {boolean} requireLogin
*/
/**
 * 
 * @returns {OFFICE_ROUTES[] | null}
 */
export function getOfficeRoutes() {
    const data = localStorage.getItem("OFFICE_ROUTES")
    if (!data) return null
    return JSON.parse(data)
}
export function clearOfficeRoutes() {
    const OFFICE_ROUTES = localStorage.getItem("OFFICE_ROUTES")
    if (OFFICE_ROUTES) {
        localStorage.removeItem("OFFICE_ROUTES")
    }
}