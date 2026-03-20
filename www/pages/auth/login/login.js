// @ts-nocheck
import { loginSchema } from "../../../../shared/validators/src/user.js";
import {
  initInputs,
  setError,
  clearError,
  getInput,
  clearFormErrors,
} from "../../../components/input.js";
import { hideLoading, showLoading } from "../../../components/loading.js";
import { api } from "../../../utils/api.js";
import Swal from "../../../lib/sweetalert2.js";
import { isLoggedIn } from "../../../utils/cookie.js";

// เมื่อ window โหลดเสร็จ
window.addEventListener("load", () => {
  showLoading();

  const isLogged = isLoggedIn();
  if (isLogged) {
    window.location.href = "/pages/index.html";
  }
  const page = document.querySelector(".login-page");

  if (!page) return;

  initInputs();

  setTimeout(() => {
    hideLoading();
    page.style.visibility = "visible";
  }, 500);
});

async function loginForm(e) {
  e.preventDefault();

  const form = e.target;
  if (!form) {
    return;
  }
  const formData = new FormData(form);

  const data = {
    email: formData.get("email")?.toString().trim(),
    password: formData.get("password")?.toString().trim(),
  };

  clearFormErrors(form);

  const parsed = loginSchema.safeParse(data);

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

  try {
    const res = await api.post("/auth/login", JSON.stringify(parsed.data), {
      headers: { "Content-Type": "application/json" },
    });
    if (res.data) {
      Swal.fire({ // sweetalert2
        title: "เข้าสู่ระบบสำเร็จ",
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
}

const form = document.querySelector(".login-form");

if (form) {
  form.addEventListener("submit", loginForm);
}
