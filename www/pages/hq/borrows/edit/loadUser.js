import { api } from "../../../../utils/api.js";

export async function loadUser() {
  const res = await api.get("/users?bypass=yes");
  return res.data.data;
}
