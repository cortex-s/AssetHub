// @ts-nocheck
import { api } from "../../../../utils/api.js";

export async function loadBorrow(id) {
  const res = await api.get(`/borrows/${id}`);
  return res.data.data;
}
