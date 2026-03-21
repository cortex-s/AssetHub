import { forceLogout, getAuth } from "../utils/cookie.js";
import { clearOfficeRoutes } from "../utils/route.js";

const basePath = "/pages";
const pathList = [
  { id: "index", label: "หน้าแรก", href: "/index.html" },
  { id: "login", label: "เข้าสู่ระบบ", href: "/auth/login", loggedShouldHide: true },
  { id: "history", label: "ประวัติการยืม", href: "/history", requireLogin: true },
  { id: "backoffice", label: "หลังบ้าน", href: "/hq", requireLogin: true, role: ["ADMIN", "STAFF"] },
  { id: "logout", label: "ออกจากระบบ", href: "#logout", requireLogin: true }
];

function isLoggedIn() {
  // ตรวจสอบว่ามี cookie accessToken หรือไม่
  return document.cookie
    .split(";")
    .some((c) => c.trim().startsWith("accessToken="));
}

export function initNavbar(containerId = "navbar") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const loggedIn = getAuth();
  if (!loggedIn) {
    clearOfficeRoutes()
  }
  // กรอง pathList ตาม loggedShouldHide
  const filteredPaths = pathList.filter((item) => {
    if (item.role && loggedIn && !item?.role.includes(loggedIn.role))return false
      if (item.requireLogin && !loggedIn) return false
    if (item.loggedShouldHide && loggedIn) return false; // hide ถ้า login
    return true;
  });

  const menuItems = filteredPaths
    .map(
      (item) =>
        `<li><a id="${item.id}" href="${basePath.concat(item.href)}">${item.label}</a></li>`,
    )
    .join("");

  container.innerHTML = `
    <nav class="navbar">
      <div class="navbar-brand">
        <a href="${basePath.concat(pathList[0].href)}" class="logo">AssetHub</a>
      </div>
      <ul class="navbar-menu">
        ${menuItems}
      </ul>
      <button class="navbar-toggle" aria-label="Toggle Menu">☰</button>
    </nav>
  `;

  const toggleBtn = container.querySelector(".navbar-toggle");
  const menu = container.querySelector(".navbar-menu");

  if (!toggleBtn || !menu) return;
  toggleBtn.addEventListener("click", () => menu.classList.toggle("active"));


}
document.addEventListener("click", (e) => {
  const target = e.target;

  if (!(target instanceof HTMLElement)) return;

  if (target.id === "logout") {
    e.preventDefault();

    forceLogout();

    window.location.href = "/pages/auth/login";
  }
});
// เรียก init
initNavbar();
