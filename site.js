/* =========================================================================
   SHARED SCRIPT — used by every page (index.html, about.html, ...)
   ========================================================================= */

// ================= Projects drop-down in the menu =================
// With a mouse, the panel opens on hover (that part is just CSS in styles.css).
// This script adds the rest:
//   - clicking / tapping / pressing Enter on "Projects" opens and closes it (phones, keyboards)
//   - Escape, clicking somewhere else, or tabbing away closes it
document.querySelectorAll(".has-dropdown").forEach(item => {
  const toggle = item.querySelector(".nav-toggle");

  function setOpen(open) {
    item.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open)); // tells screen readers whether it's open
  }

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Escape closes it and puts the keyboard focus back on "Projects".
  item.addEventListener("keydown", event => {
    if (event.key === "Escape" && item.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Clicking or tapping anywhere outside closes it.
  document.addEventListener("click", event => {
    if (!item.contains(event.target)) setOpen(false);
  });

  // Tabbing past the last project closes it.
  item.addEventListener("focusout", event => {
    if (event.relatedTarget && !item.contains(event.relatedTarget)) setOpen(false);
  });

  // When the mouse leaves, drop any click-opened state so it closes like a normal hover menu.
  item.addEventListener("pointerleave", event => {
    if (event.pointerType === "mouse") setOpen(false);
  });
});
