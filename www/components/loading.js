/**
 * แสดง loading overlay
 * @param {string} [text]
 */
export function showLoading(text = "กำลังโหลด...") {
  // กันซ้ำ
  if (document.getElementById("app-loading")) return;

  const el = document.createElement("div");
  el.id = "app-loading";

  el.innerHTML = `
    <div class="loading-box">
      <div class="spinner"></div>
      <p>${text}</p>
    </div>
  `;

  document.body.appendChild(el);
}

/**
 * ซ่อน loading overlay
 */
export function hideLoading() {
  const el = document.getElementById("app-loading");
  if (el) el.remove();
}
