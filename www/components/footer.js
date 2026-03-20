export function initFooter(containerTag = "footer") {
  const container = document.querySelector(containerTag);
  if (!container) return;

  container.innerHTML = `
    <div class="container footer">
      © 2026 Asset Hub
    </div>
  `;
}
initFooter();
