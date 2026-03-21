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
import Swal from "/lib/sweetalert2.js";
import { loadBorrow } from "./loadBorrow.js";
import { borrowSchema } from "../../../../validators/src/borrows.js";

const statusOptions = [
  { value: "borrowed", label: "ถูกยืม" },
  { value: "returned", label: "คืนแล้ว" },
  { value: "overdue", label: "เกินกำหนด" },
  { value: "cancelled", label: "ยกเลิก" },
];

let borrowId = "";

window.addEventListener("load", async () => {
  showLoading();
  initInputs();

  const params = new URLSearchParams(window.location.search);
  borrowId = params.get("id");

  const borrowData = await loadBorrow(borrowId);

  fillForm(borrowData);

  document.getElementById("hero-text").innerText = `#${borrowData.id}`;

  const statusWrapper = document.querySelector(
    '[data-input][data-name="status"][data-type="select"]'
  );

  setSelectOptions(statusWrapper, statusOptions, "เลือกสถานะ", borrowData.status);

  setTimeout(() => {
    document.querySelector(".container").style.visibility = "visible";
    hideLoading();
  }, 500);
});

const form = document.querySelector(".form-asset");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  form.querySelectorAll("input, select").forEach((el) => clearError(el));

  const data = {
    id: borrowId,
    status: getInput("status")?.value,
    internalNotes: getInput("internalNotes")?.value || undefined,
    publicReturnedNotes: getInput("publicReturnedNotes")?.value || undefined,
    returnDate: getInput("returnDate")?.value || undefined,
  };

  const parsed = borrowSchema.edit.safeParse(data);

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
    const res = await api.patch(
      "/borrows/edit",
      JSON.stringify(parsed.data),
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    Swal.fire({
      title: res.data.message,
      icon: "success",
      timer: 3000,
      showConfirmButton: false,
    });

    setTimeout(() => window.location.reload(), 3200);
  } catch (error) {
    Swal.fire({
      title: error?.response?.data?.message,
      icon: "error",
      timer: 3000,
      showConfirmButton: false,
    });
  }
});