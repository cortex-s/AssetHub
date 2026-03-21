import z from "zod";

const status = z.enum(["borrowed", "returned", "overdue", "cancelled"]);
const internalNotes = z.string().max(500, "จำกัด 500 ตัวอักษร").nullable().optional();
const publicReturnedNotes = z
  .string()
  .max(500, "จำกัด 500 ตัวอักษร")
  .nullable().optional();
const returnDate = z.coerce.date().nullable().optional();

const borrow = z.object({
  assetId: z.string("โปรดเลือกทรัพย์สิน").min(1, "โปรดเลือกทรัพย์สิน").max(100),
  userId: z.string("โปรดเลือกผู้ยืม").min(1, "โปรดเลือกผู้ยืม").max(100),
  borrowDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  returnDate,
  internalNotes,
});

const edit = z.object({
  id: z.string().min(1).max(100),
  status,
  internalNotes,
  publicReturnedNotes,
  returnDate
});

export const borrowSchema = { borrow, edit };
