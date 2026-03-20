export function isLoggedIn() {
  // ตรวจสอบว่า cookie มี accessToken หรือไม่
  return document.cookie
    .split(";")
    .some((c) => c.trim().startsWith("accessToken="));
}
