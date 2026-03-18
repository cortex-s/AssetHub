import z from "zod";

const name = z
  .string("โปรดกรอกชื่อหมวดหมู่")
  .min(1, "โปรดกรอกชื่อหมวดหมู่")
  .max(50, "สูงสุด 50 ตัวอักษร")
  .trim();
const description = z
  .string()
  .min(10, "ขั้นต่ำ 10 ตัวอักษร")
  .max(500, "สูงสุด 500 ตัวอักษร")
  .trim()
  .nullable();
export const add = z
  .object({
    name,
    description,
  })
  .transform((x) => ({ name: x.name, description: x.description || null }));

export const edit = z
  .object({
    id: z.string().min(1).max(100),
    name,
    description,
  })
  .transform((x) => ({
    id: x.id,
    name: x.name,
    description: x.description || null,
  }));
