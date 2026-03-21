// @ts-nocheck
import {
  clearError,
  getInput,
  setError,
  initInputs,
  setSelectOptions,
} from "../../../../components/input.js";
import { hideLoading, showLoading } from "/components/loading.js";
import { api } from "/utils/api.js";
import { getAuth } from "../../../../utils/cookie.js";
import { assetSchema } from "../../../../validators/src/assets.js";
import { loadCategory } from "./loadCategory.js";
import Swal from "/lib/sweetalert2.js";

window.addEventListener("load", async () => {
  showLoading()
  initInputs();
  const container = document.querySelector(".container")
  if (!container) {
    return;
  }

  const isLogged = getAuth()
  if (!isLogged || !["ADMIN", "STAFF"].includes(isLogged.role)) {
    window.location.href = "/pages/"
  }

  // ดึงข้อมูล category
  const rawData = await loadCategory(); // [{id,name,description,...}, ...]

  // แปลงเป็น { id, name} เท่านั้น
  const categories = rawData.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));


  // หา select category
  const categoryWrapper = document.querySelector(
    '[data-input][data-name="categoryId"][data-type="select"]',
  );
  if (!categoryWrapper) return;
  setSelectOptions(categoryWrapper, categories, "ไม่มีหมวดหมู่")

  setTimeout(() => {
    container.style.visibility = "visible"
    hideLoading()
  }, 500)
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
    if (res.data) {
      Swal.fire({ // sweetalert2
        title: res.data.message,
        icon: "success",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false, // ไม่แสดงปุ่ม OK
        allowOutsideClick: false, // ป้องกันการคลิกข้างนอก
        allowEscapeKey: false, // ป้องกันการกด ESC
        allowEnterKey: false, // ป้องกันการกด Enter
      });
      setTimeout(() => {
        window.location.reload();
      }, 3200);
    }
  } catch (error) {
    Swal.fire({
      title: error?.response?.data?.message,
      icon: "error",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false, // ไม่แสดงปุ่ม OK
      allowOutsideClick: false, // ป้องกันการคลิกข้างนอก
      allowEscapeKey: false, // ป้องกันการกด ESC
      allowEnterKey: false, // ป้องกันการกด Enter
    });
  }
});
