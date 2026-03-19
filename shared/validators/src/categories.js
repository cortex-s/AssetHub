import z from "zod";

const name = z
  .string("โปรดกรอกชื่อหมวดหมู่")
  .min(1, "โปรดกรอกชื่อหมวดหมู่")
  .max(50, "สูงสุด 50 ตัวอักษร")
  .trim();
const description = z
  .string()
  .max(500, "สูงสุด 500 ตัวอักษร")
  .trim()
  .nullable()
  .optional();
const addCategorySchema = z.object({
  name,
  description,
});

const editCategorySchema = addCategorySchema.extend({
  id: z.string().min(1).max(100),
});
// export
export const categorySchema = {
  add: addCategorySchema,
  edit: editCategorySchema,
};
