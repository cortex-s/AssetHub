// @ts-nocheck

export function initInputs() {
  /** @type {NodeListOf<HTMLElement>} */
  const wrappers = document.querySelectorAll("[data-input]");

  wrappers.forEach((wrapper) => {
    const name = wrapper.dataset.name;
    const label = wrapper.dataset.label || "";
    const placeholder = wrapper.dataset.placeholder || "";
    const type = wrapper.dataset.type || "text"; // default text input
    const id = `${name}-input`;

    wrapper.classList.add("form-group");

    // สร้าง label
    const labelHTML = label
      ? `<label for="${id}" class="form-label">${label}</label>`
      : "";

    // ถ้าเป็น select
    if (type === "select") {
      let optionsHTML = "";
      try {
        const options = JSON.parse(wrapper.dataset.options || "[]");
        optionsHTML = options
          .map((opt) => `<option value="${opt.value}">${opt.label}</option>`)
          .join("");
      } catch (err) {
        console.warn(`Invalid JSON in data-options for ${name}:`, err);
      }

      wrapper.innerHTML = `
        ${labelHTML}
        <select id="${id}" name="${name}" class="input">
          ${optionsHTML}
        </select>
        <p class="input-error"></p>
      `;

      const select = wrapper.querySelector("select");
      if (!select) return;

      select.addEventListener("focus", () =>
        wrapper.classList.add("is-focused"),
      );
      select.addEventListener("blur", () =>
        wrapper.classList.remove("is-focused"),
      );
      select.addEventListener("change", () => clearError(select));
    } else {
      // ปกติสร้าง input
      wrapper.innerHTML = `
        ${labelHTML}
        <input 
          id="${id}"
          class="input"
          name="${name}"
          type="${type}"
          placeholder="${placeholder}"
        />
        <p class="input-error"></p>
      `;

      const input = wrapper.querySelector("input");
      if (!input) return;

      input.addEventListener("focus", () =>
        wrapper.classList.add("is-focused"),
      );
      input.addEventListener("blur", () =>
        wrapper.classList.remove("is-focused"),
      );
      input.addEventListener("input", () => clearError(input));
    }
  });
}

/**
 * @param {HTMLInputElement|HTMLSelectElement} input
 * @param {string} message
 */
export function setError(input, message) {
  if (!input) return;

  const wrapper = input.closest("[data-input]");
  if (!wrapper) return;

  const errorEl = wrapper.querySelector(".input-error");

  input.classList.add("error");
  input.setAttribute("aria-invalid", "true");
  wrapper.classList.add("has-error");

  if (errorEl) {
    errorEl.textContent = message;
  }
}

/**
 * @param {HTMLInputElement|HTMLSelectElement} input
 */
export function clearError(input) {
  if (!input) return;

  const wrapper = input.closest("[data-input]");
  if (!wrapper) return;

  const errorEl = wrapper.querySelector(".input-error");

  input.classList.remove("error");
  input.removeAttribute("aria-invalid");
  wrapper.classList.remove("has-error");

  if (errorEl) {
    errorEl.textContent = "";
  }
}

/**
 * หา input หรือ select จาก name
 * @param {string} name
 */
export function getInput(name) {
  return document.querySelector(
    `[data-input][data-name="${name}"] input, [data-input][data-name="${name}"] select`,
  );
}

/**
 * clear error ทั้ง form
 * @param {HTMLFormElement} form
 */
export function clearFormErrors(form) {
  form.querySelectorAll("input, select").forEach((el) => clearError(el));
}

// /**
//  * Initialise all data-input components
//  * @returns {void}
//  */
// export function initInputs() {
//   /** @type {NodeListOf<HTMLElement>} */
//   const wrappers = document.querySelectorAll("[data-input]");

//   wrappers.forEach((wrapper) => {
//     const name = wrapper.dataset.name;
//     const label = wrapper.dataset.label || "";
//     const placeholder = wrapper.dataset.placeholder || "";
//     const type = wrapper.dataset.type || "text";

//     const id = `${name}-input`;

//     wrapper.classList.add("form-group");

//     wrapper.innerHTML = `
//       ${label ? `<label for="${id}" class="form-label">${label}</label>` : ""}

//       <input
//         id="${id}"
//         class="input"
//         name="${name}"
//         type="${type}"
//         placeholder="${placeholder}"
//       />

//       <p class="input-error"></p>
//     `;

//     const input = wrapper.querySelector("input");

//     if (!input) return;

//     input.addEventListener("focus", () => wrapper.classList.add("is-focused"));

//     input.addEventListener("blur", () =>
//       wrapper.classList.remove("is-focused"),
//     );

//     input.addEventListener("input", () => clearError(input));
//   });
// }

// /**
//  * @param {HTMLInputElement} input
//  * @param {string} message
//  */
// export function setError(input, message) {
//   if (!input) return;

//   const wrapper = input.closest("[data-input]");
//   if (!wrapper) return;

//   const errorEl = wrapper.querySelector(".input-error");

//   input.classList.add("error");
//   input.setAttribute("aria-invalid", "true");
//   wrapper.classList.add("has-error");

//   if (errorEl) {
//     errorEl.textContent = message;
//   }
// }

// /**
//  * @param {HTMLInputElement} input
//  */
// export function clearError(input) {
//   if (!input) return;

//   const wrapper = input.closest("[data-input]");
//   if (!wrapper) return;

//   const errorEl = wrapper.querySelector(".input-error");

//   input.classList.remove("error");
//   input.removeAttribute("aria-invalid");
//   wrapper.classList.remove("has-error");

//   if (errorEl) {
//     errorEl.textContent = "";
//   }
// }

// /**
//  * หา input จาก name
//  * @param {string} name
//  */
// export function getInput(name) {
//   return document.querySelector(`[data-input][data-name="${name}"] input`);
// }

// /**
//  * clear error ทั้ง form
//  * @param {HTMLFormElement} form
//  */
// export function clearFormErrors(form) {
//   form.querySelectorAll("input").forEach((input) => clearError(input));
// }
