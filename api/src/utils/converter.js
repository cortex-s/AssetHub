import { $Enums } from "../lib/generated/prisma/index.js";

/**
 * @param {$Enums.AssetsStatus} status 
 */
export function getAssetStatusText(status) {
    switch (status) {
        case "available":
            return "พร้อมใช้งาน";

        case "borrowed":
            return "ถูกยืม";

        case "repair":
            return "กำลังซ่อม";

        case "retired":
            return "ปลดระวาง";

        case "lost":
            return "สูญหาย";

        default:
            // ซึ่งไม่ควรเกิด
            return "ไม่ทราบสถานะ";
    }
}

/**
 * 
 * @param {$Enums.BorrowsStatus} status 
 * @returns 
 */
export function getBorrowStatusText(status) {
    switch (status) {
        case "borrowed":
            return "กำลังยืม";
        case "returned":
            return "คืนแล้ว";
        case "overdue":
            return "เกินกำหนด";
        default:
            return "ไม่ทราบสถานะ";
    }
}