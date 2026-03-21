import { api } from "../../../../utils/api.js";

export async function loadCategory() {
  const res = await api.get("/categories?bypass=yes");
  return res.data.data;
}
