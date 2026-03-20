import z from "zod";

const status = z.enum(["borrowed", "returned", "overdue", "cancelled"]);
const internalNotes = z.string().max(500, "จำกัด 500 ตัวอักษร").optional();
const publicReturnedNotes = z
  .string()
  .max(500, "จำกัด 500 ตัวอักษร")
  .optional();
const returnDate = z.coerce.date().optional();

const borrow = z.object({
  assetId: z.string("โปรดเลือกทรัพย์สิน").min(1, "โปรดเลือกทรัพย์สิน").max(100),
  userId: z.string("โปรดเลือกผู้ยืม").min(1, "โปรดเลือกผู้ยืม").max(100),
  borrowDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  returnDate,
  internalNotes,
});

const edit = borrow.extend({ status, publicReturnedNotes, returnDate });

export const borrowSchema = { borrow, edit };
