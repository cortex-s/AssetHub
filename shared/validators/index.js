
import z from "zod";

export const basicData = z.object({ username: z.string().min(3).max(100) });

/**
 * @typedef {z.infer<typeof basicData>} BasicData
 */
