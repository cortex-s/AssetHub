import { api } from "../../../../utils/api.js";

export async function loadAsset() {
  const res = await api.get("/assets?bypass=yes");
  return res.data.data;
}
