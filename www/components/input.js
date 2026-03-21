// @ts-nocheck

export function initInputs() {
  /** @type {NodeListOf<HTMLElement>} */
  const wrappers = document.querySelectorAll("[data-input]");

  wrappers.forEach((wrapper) => {
    const name = wrapper.dataset.name;
    const label = wrapper.dataset.label || "";
    const placeholder = wrapper.dataset.placeholder || "";
    const type = wrapper.dataset.type || "text";
    const id = `${name}-input`;

    //  รองรับ disabled
    const isDisabled =
      wrapper.hasAttribute("data-disabled") ||
      wrapper.hasAttribute("disabled");

    wrapper.classList.add("form-group");

    const labelHTML = label
      ? `<label for="${id}" class="form-label">${label}</label>`
      : "";

    // =========================
    // SELECT
    // =========================
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
        <select 
          id="${id}" 
          name="${name}" 
          class="input"
          ${isDisabled ? "disabled" : ""}
        >
          ${optionsHTML}
        </select>
        <p class="input-error"></p>
      `;

      const select = wrapper.querySelector("select");
      if (!select) return;

      select.addEventListener("focus", () =>
        wrapper.classList.add("is-focused")
      );
      select.addEventListener("blur", () =>
        wrapper.classList.remove("is-focused")
      );
      select.addEventListener("change", () => clearError(select));
    } else {
      // =========================
      // INPUT
      // =========================
      wrapper.innerHTML = `
        ${labelHTML}
        <input 
          id="${id}"
          class="input"
          name="${name}"
          type="${type}"
          placeholder="${placeholder}"
          ${isDisabled ? "disabled" : ""}
        />
        <p class="input-error"></p>
      `;

      const input = wrapper.querySelector("input");
      if (!input) return;

      input.addEventListener("focus", () =>
        wrapper.classList.add("is-focused")
      );
      input.addEventListener("blur", () =>
        wrapper.classList.remove("is-focused")
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
export function fillForm(data) {
  const inputs = document.querySelectorAll("[data-input]");

  inputs.forEach((wrapper) => {
    const name = wrapper.dataset.name;
    if (!name) return;

    const input = wrapper.querySelector("input, select, textarea");
    if (!input) return;

    // set value
    if (data[name] !== undefined && data[name] !== null) {
      input.value = data[name];
    }
  });
}
export function setSelectOptions(wrapper, options, placeholderText, defaultValue) {
  const select = wrapper.querySelector("select");
  if (!select) return;

  select.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = placeholderText;
  select.appendChild(placeholder);

  options.forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt.value;
    option.textContent = opt.label;
    if (defaultValue && opt.value === defaultValue) {
      option.selected = true
    }
    select.appendChild(option);
  });
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
