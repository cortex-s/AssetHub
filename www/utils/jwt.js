// Interface ของ JWT ที่ผมออกแบบไว้ในส่วนของ Backend
/**
 * @typedef {Object} JWTPayload
 * @property {string} userId
 * @property {string} fullname
 * @property {"STAFF"|"ADMIN"|"USER"} role
 * @property {number} iat
 * @property {number} exp
 */
/**
* @param {string} token
* @returns {JWTPayload| null} payload | null ถ้าผิดพลาด
*/
export function decodeJWT(token) {
    try {
        if (!token) return null;

        const parts = token.split(".");
        if (parts.length !== 3) return null;

        // base64url -> base64
        const base64 = parts[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
        );

        return JSON.parse(jsonPayload);
    } catch (err) {
        console.error("JWT decode error:", err);
        return null;
    }
}