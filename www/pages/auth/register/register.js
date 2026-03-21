// @ts-nocheck
import { registerSchema } from "../../../../shared/validators/src/user.js";
import {
  initInputs,
  setError,
  getInput,
  clearFormErrors,
} from "../../../components/input.js";
import { hideLoading, showLoading } from "../../../components/loading.js";
import { api } from "../../../utils/api.js";
import Swal from "../../../lib/sweetalert2.js";
import { getAuth } from "../../../utils/cookie.js";

window.addEventListener("load", () => {
  showLoading();

  const isLogged = getAuth();
  if (isLogged) {
    window.location.href = "/pages/";
  }

  const page = document.querySelector(".register-page");
  if (!page) return;

  initInputs();

  setTimeout(() => {
    hideLoading();
    page.style.visibility = "visible";
  }, 500);
});

async function registerForm(e) {
  e.preventDefault();

  const form = e.target;
  if (!form) return;

  const formData = new FormData(form);

  const data = {
    firstname: formData.get("firstname")?.toString().trim(),
    lastname: formData.get("lastname")?.toString().trim(),
    email: formData.get("email")?.toString().trim(),
    password: formData.get("password")?.toString().trim(),
  };

  clearFormErrors(form);

  const parsed = registerSchema.safeParse(data);

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
    const res = await api.post("/auth/register", JSON.stringify(parsed.data), {
      headers: { "Content-Type": "application/json" },
    });

    Swal.fire({
      title: "สมัครสมาชิกสำเร็จ",
      icon: "success",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    });

    setTimeout(() => {
      window.location.href = "/pages/auth/login";
    }, 3200);
  } catch (error) {
    Swal.fire({
      title: error?.response?.data?.message || "เกิดข้อผิดพลาด",
      icon: "error",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    });
  }
}

const form = document.querySelector(".register-form");

if (form) {
  form.addEventListener("submit", registerForm);
}