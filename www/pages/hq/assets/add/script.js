// @ts-nocheck
import {
  clearError,
  getInput,
  setError,
  initInputs,
} from "../../../../components/input.js";
import { hideLoading, showLoading } from "../../../../components/loading.js";
import { api } from "../../../../utils/api.js";
import { assetSchema } from "../../../../validators/src/assets.js";
import { loadCategory } from "./loadCategory.js";

window.addEventListener("load", async () => {
  initInputs();

  // ดึงข้อมูล category
  const rawData = await loadCategory(); // [{id,name,description,...}, ...]

  // แปลงเป็น { id, name} เท่านั้น
  const categories = rawData.map((cat) => ({
    id: cat.id,
    name: cat.name,
  }));

  // หา select category
  const categoryWrapper = document.querySelector(
    '[data-input][data-name="categoryId"][data-type="select"]',
  );
  if (!categoryWrapper) return;

  const select = categoryWrapper.querySelector("select");
  if (!select) return;

  // ล้าง option เดิม
  select.innerHTML = "";

  // เพิ่ม placeholder
  const placeholder = categoryWrapper.dataset.placeholder || "เลือกหมวดหมู่";
  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.textContent = placeholder;
  select.appendChild(placeholderOption);

  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.name;
    select.appendChild(option);
  });
});

const form = document.querySelector(".form-asset");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  form.querySelectorAll("input, select").forEach((el) => clearError(el));

  const data = {
    assetCode: getInput("assetCode")?.value || "",
    serialNo: getInput("serialNo")?.value || "",
    name: getInput("name")?.value || "",
    categoryId: getInput("categoryId")?.value || null, // dropdown id
    notes: getInput("notes")?.value || null,
  };
  try {
    const parsed = assetSchema.add.safeParse(data);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      Object.entries(errors).forEach(([field, messages]) => {
        const input = getInput(field);
        if (input && messages?.[0]) {
          setError(input, messages[0]);
        }
      });
      return;
    }

    const res = await api.post("/assets/add", JSON.stringify(parsed.data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {}
});
