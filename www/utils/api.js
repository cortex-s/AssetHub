// @ts-nocheck

/**
 * ทุกหน้าที่จะใช้ไฟล์นี้
 * ต้อง import axios ผ่าน <script> ใน HTML ก่อนเสมอ
 *
 *   <script type="module" src="/lib/axios.js"></script>
 *
 * ถ้าไม่ใส่ → axios is not defined
 */

export const api = axios.create({
  baseURL: "http://localhost:8888/api",
  withCredentials: true, // เพราะใช้ backend มีการใช้ cookie ด้วยดังนั้นต้องเปิดไว้ จะได้ไม่ต้องไปเปิดตอนยิง api
  timeout: 10000,
});
