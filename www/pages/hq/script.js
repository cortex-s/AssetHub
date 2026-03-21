import { hideLoading, showLoading } from "../../components/loading.js";
import { getAuth } from "../../utils/cookie.js";
import { getOfficeRoutes } from "../../utils/route.js";
const basePath = "/pages"
window.addEventListener("load", () => {
    showLoading()

    const isLogged = getAuth()
    if (!isLogged) return;

    // @ts-ignore
    const routes = getOfficeRoutes()
    if (!routes) return
    const container = document.getElementById("render-buttons");
    if (!container) return;

    const html = routes
        .map(
            (route) => `
        <a href="${basePath + route.href}">
          <button type="button" class="btn-primary">
            ${route.label}
          </button>
        </a>
      `
        )
        .join("");

    container.innerHTML = html;
    setTimeout(() => {
        hideLoading()
    }, 1000)
})