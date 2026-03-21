import z from "zod";

const addAssetSchema = z.object({
  assetCode: z
    .string("โปรดกรอกรหัสย่อเช่น LAP-001")
    .min(1, "โปรดกรอกรหัสย่อเช่น LAP-001")
    .max(25, "จำกัด 25 ตัวอักษร"),
  serialNo: z
    .string("โปรดกรอก Serial Number")
    .min(1, "โปรดกรอก Serial Number")
    .max(100, "จำกัด 100 ตัวอักษร"),
  name: z
    .string("โปรดกรอกชื่อ")
    .min(1, "โปรดกรอกชื่อ")
    .max(100, "จำกัด 100 ตัวอักษร"),

  categoryId: z.string().max(100).nullable().optional(),

  notes: z.string().max(100).nullable().optional(),

  //   warrantyExpire:z.coerce.date
});

const editAssetSchema = addAssetSchema.extend({
  id: z.string().min(1).max(100),

  status: z.enum(
    ["available", "borrowed", "repair", "retired", "lost"],
    "โปรดเลือกสถานะทรัพย์สิน",
  ),
}).transform((x) => ({
  ...x,
  notes: x.notes || null,
  categoryId: x.categoryId || null,
}));;

const deleteAssetSchema = z.object({ id: z.string().min(1).max(100) });

// export
export const assetSchema = {
  add: addAssetSchema,
  edit: editAssetSchema,
  del: deleteAssetSchema,
};
