export function goBack() {
  const el = document.getElementById("goback");
  if (!el) return;

  const parts = window.location.pathname.split("/").filter(Boolean);

  const newParts = [...parts];

  //  ตรวจว่าอยู่ใน edit/add
  const last = newParts[newParts.length - 1];
  const secondLast = newParts[newParts.length - 2];

  if (["edit", "add"].includes(secondLast)) {
    newParts.pop(); // index.html
    newParts.pop(); // edit/add
  } else {
    newParts.pop(); // ปกติ
  }

  const backPath =
    "/" + newParts.join("/") + (newParts.length ? "/" : "");

  const btn = document.createElement("button");
  btn.textContent = "⬅️ Back";

  // ✅ UI เดิมคุณ (ไม่หาย)
  btn.style.padding = "8px 12px";
  btn.style.border = "1px solid #e5e7eb";
  btn.style.borderRadius = "8px";
  btn.style.background = "white";
  btn.style.cursor = "pointer";

  btn.onclick = () => {
    window.location.href = backPath;
  };

  el.appendChild(btn);
}

// call
goBack();