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
import Swal from "/lib/sweetalert2.js";
import { loadAsset } from "./loadAsset.js";
import { loadUser } from "./loadUser.js";
import { borrowSchema } from "../../../../validators/src/borrows.js";

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
  const rawData = await loadAsset(); // [{id,name,description,...}, ...]

  // แปลงเป็น { id, name} เท่านั้น
  const assets = rawData.filter((x)=>x.status === "available").map((e) => ({
    value: e.id,
    label: e.assetCode.concat(" / ", e.name),
  }));
  // ดึงข้อมูล user
  const rawUsers = await loadUser();

  const users = rawUsers.map((user) => ({
    value: user.id,
    label: user.id.split("-")[0].concat(" / ", user.firstname, " ", user.lastname),
  }));

  const assetWrapper = document.querySelector(
    '[data-input][data-name="assetId"][data-type="select"]',
  );
  if (!assetWrapper) return;
  setSelectOptions(assetWrapper, assets, "เลือกทรัพย์ที่ต้องการยืม")


  const userWrapper = document.querySelector(
    '[data-input][data-name="userId"][data-type="select"]'
  );

  if (userWrapper) {
    setSelectOptions(userWrapper, users, "เลือกผู้ใช้งาน");
  }

  setTimeout(() => {
    container.style.visibility = "visible"
    hideLoading()
  }, 500)
});

const form = document.querySelector(".form-borrow");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  form.querySelectorAll("input, select").forEach((el) => clearError(el));

  const data = {
    assetId: getInput("assetId")?.value || "",
    userId: getInput("userId")?.value || "",
    borrowDate: getInput("borrowDate")?.value || "",
    dueDate: getInput("dueDate")?.value || "",
    returnDate: getInput("returnDate")?.value || null,
    internalNotes: getInput("notes")?.value || null,
  };
  try {
    const parsed = borrowSchema.borrow.safeParse(data);
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

    const res = await api.post("/borrows/borrow", JSON.stringify(parsed.data), {
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
