import z from "zod";

export const testX = z.object({ name: z.string().min(5) });
