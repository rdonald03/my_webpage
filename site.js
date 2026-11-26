/* =========================================================================
   SHARED SCRIPT — used by every page (index.html, about.html, ...)
   ========================================================================= */

// ================= Projects drop-down in the menu =================
// Mouse: clicking the word "Projects" goes to the All projects page, and hovering opens the panel
//        (the hover part is just CSS in styles.css).
// Phones and tablets (tapping with a finger): tapping "Projects" opens and closes the panel
//        instead of leaving the page; "All projects" is at the bottom of the panel.
// Keyboard: Enter on "Projects" goes to the page; Enter on the small arrow beside it opens the panel.
// Escape, clicking somewhere else, or tabbing away closes it.
document.querySelectorAll(".has-dropdown").forEach(item => {
  const toggle = item.querySelector(".nav-toggle");
  const link = item.querySelector(":scope > a");    // the word "Projects"
  let lastPointerType = "";                          // "touch", "mouse" or "pen": how "Projects" was pressed

  function setOpen(open) {
    item.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open)); // tells screen readers whether it's open
  }

  const toggleOpen = () => setOpen(toggle.getAttribute("aria-expanded") !== "true");

  toggle.addEventListener("click", toggleOpen);

  if (link) {
    link.addEventListener("pointerdown", event => { lastPointerType = event.pointerType; });
    link.addEventListener("click", event => {
      if (lastPointerType === "touch") {   // a finger tap: open the list rather than leave the page
        event.preventDefault();
        toggleOpen();
      }
      lastPointerType = "";
    });
  }

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
