// @ts-nocheck
import { hideLoading, showLoading } from "../../../components/loading.js"
import { getAuth } from "../../../utils/cookie.js"

window.addEventListener("load", () => {
    showLoading()

    const isLogged = getAuth()
    if (!isLogged || !["ADMIN", "STAFF"].includes(isLogged.role)) {
        window.location.href = "/pages/"
    }
    const container = document.querySelector(".container")
    if (!container) return;

    setTimeout(() => {
        container.style.visibility = "visible"
        hideLoading()
    }, 1000)
})