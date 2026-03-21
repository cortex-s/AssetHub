// @ts-nocheck
import { api } from "../../../../utils/api.js";

export async function loadAsset(id) {
  const res = await api.get(`/assets/${id}`);
  return res.data.data;
}
