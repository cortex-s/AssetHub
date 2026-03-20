const basePath = "/pages";
const pathList = [
  { label: "หน้าแรก", href: "/index.html" },
  { label: "เข้าสู่ระบบ", href: "/auth/login", loggedShouldHide: true },
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

  const loggedIn = isLoggedIn();

  // กรอง pathList ตาม loggedShouldHide
  const filteredPaths = pathList.filter((item) => {
    if (item.loggedShouldHide && loggedIn) return false; // hide ถ้า login
    return true;
  });

  const menuItems = filteredPaths
    .map(
      (item) =>
        `<li><a href="${basePath.concat(item.href)}">${item.label}</a></li>`,
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

// เรียก init
initNavbar();
