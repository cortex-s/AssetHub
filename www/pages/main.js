// @ts-nocheck
import { hideLoading, showLoading } from "../components/loading.js";

window.addEventListener("load", () => {
  showLoading();

  setTimeout(() => {
    hideLoading();
  }, 500);
});
