import z from "zod";
const email = z.email("โปรดกรอกอีเมลให้ถูกต้อง").trim();
const username = z
  .string({ message: "โปรดกรอกชื่อผู้ใช้" })
  .min(6, "ขั้นต่ำ 6 ตัวอักษร")
  .max(12, "สูงสุด 12 ตัวอักษร")
  .trim();
const password = z
  .string({ message: "โปรดกรอกรหัสผ่าน" })
  .min(8, "ขั้นต่ำ 8 ตัวอักษร")
  .max(16, "สูงสุด 16 ตัวอักษร")
  .trim();

export const registerSchema = z.object({
  email,
  password,
  firstname: z
    .string({ message: "โปรดกรอกชื่อ" })
    .min(1, "โปรดกรอกชื่อ")
    .max(50, "สูงสุด 50 ตัวอักษร")
    .trim(),
  lastname: z
    .string({ message: "โปรดกรอกนามสกุล" })
    .min(1, "โปรดกรอกนามสกุล")
    .max(50, "สูงสุด 50 อักษร")
    .trim(),
});

export const loginSchema = z.object({ email, password });
