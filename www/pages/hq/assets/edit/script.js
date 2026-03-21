// @ts-nocheck
import {
  clearError,
  getInput,
  setError,
  initInputs,
  fillForm,
  setSelectOptions,
} from "../../../../components/input.js";
import { hideLoading, showLoading } from "/components/loading.js";
import { api } from "/utils/api.js";
import { getAuth } from "../../../../utils/cookie.js";
import { assetSchema } from "../../../../validators/src/assets.js";
import { loadCategory } from "./loadCategory.js";
import Swal from "/lib/sweetalert2.js";
import { loadAsset } from "./loadAsset.js";
const statusOptions = [
  { value: "available", label: "พร้อมใช้งาน" },
  { value: "borrowed", label: "ถูกยืม" },
  { value: "repair", label: "กำลังซ่อม" },
  { value: "retired", label: "ปลดระวาง" },
  { value: "lost", label: "สูญหาย" }
];
let assetId = ""
window.addEventListener("load", async () => {
  showLoading()
  initInputs();


  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  assetId = id

  const asset = await loadAsset(id)
  fillForm(asset)
  const heroText = document.getElementById("hero-text")
  if (!heroText) return
  heroText.innerText = `ทรัพย์สิน: ${asset.name}`
  const statusWrapper = document.querySelector(
    '[data-input][data-name="status"][data-type="select"]'
  );
  const categoryWrapper = document.querySelector(
    '[data-input][data-name="categoryId"][data-type="select"]'
  );
  setSelectOptions(statusWrapper, statusOptions, "เลือกสถานะ", asset.status);
  const container = document.querySelector(".container")
  if (!container) return



  // ดึงข้อมูล category
  const rawData = await loadCategory(); // [{id,name,description,...}, ...]

  // แปลงเป็น { id, name} เท่านั้น
  const categories = rawData.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));
  setSelectOptions(categoryWrapper, categories, "ไม่มีหมวดหมู่", asset.categoryId)

  setTimeout(() => {
    container.style.visibility = "visible"
    hideLoading()
  }, 1000)
});

const form = document.querySelector(".form-asset");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  form.querySelectorAll("input, select").forEach((el) => clearError(el));

  const data = {
    id: assetId,
    assetCode: getInput("assetCode")?.value || "",
    serialNo: getInput("serialNo")?.value || "",
    name: getInput("name")?.value || "",
    categoryId: getInput("categoryId")?.value || null, // dropdown id
    notes: getInput("notes")?.value || null,
    status: getInput("status")?.value
  };
  try {
    const parsed = assetSchema.edit.safeParse(data);
    if (!parsed.success) {
      console.log(parsed.error)
      const errors = parsed.error.flatten().fieldErrors;
      Object.entries(errors).forEach(([field, messages]) => {
        const input = getInput(field);
        if (input && messages?.[0]) {
          setError(input, messages[0]);
        }
      });
      return;
    }
    console.log(data)

    const res = await api.patch("/assets/edit", JSON.stringify(parsed.data), {
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
    setTimeout(() => {
      window.location.reload();
    }, 3200);
  }
});
