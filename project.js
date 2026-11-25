/* =========================================================================
   PROJECT SCRIPT — shared by projects.html and every individual project page.
   ========================================================================= */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// ================= Page title: letters rise in one after another (same as the other pages) =================
// The whole title always takes about as long as "Ryan Donald" on the homepage,
// however many letters it has.
const title = document.getElementById("title");
if (title) {
  const text = title.textContent.trim();
  const delayPerLetter = Math.min(0.1, 0.4 / Math.max(text.length - 1, 1));
  title.setAttribute("aria-label", text);   // screen readers still read it as one phrase
  title.textContent = "";
  [...text].forEach((character, index) => {
    const span = document.createElement("span");
    span.className = "letter";
    span.textContent = character;
    span.setAttribute("aria-hidden", "true");
    span.style.animationDelay = (index * delayPerLetter) + "s";
    title.appendChild(span);
  });
}

// Keep the footer year current.
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();


// ================= Gentle fade-in as sections and figures scroll into view =================
const fadeItems = document.querySelectorAll(".fade");

if ("IntersectionObserver" in window && !reduceMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);   // only once
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
  fadeItems.forEach(item => observer.observe(item));
} else {
  fadeItems.forEach(item => item.classList.add("is-visible"));
}


// ================= Contents list: highlight the section being read =================
const tocLinks = [...document.querySelectorAll(".toc a[href^='#']")];

if (tocLinks.length) {
  const sections = tocLinks
    .map(link => document.getElementById(link.getAttribute("href").slice(1)))
    .filter(Boolean);
  let ticking = false;

  function updateContents() {
    ticking = false;
    // A section counts as "being read" once its top passes this line near the top of the screen.
    const readingLine = Math.min(window.innerHeight * 0.3, 150);
    let active = sections[0];
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= readingLine) active = section;
    });
    // At the very bottom of the page, the last section is the one being read.
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      active = sections[sections.length - 1];
    }
    tocLinks.forEach(link => {
      const isActive = link.getAttribute("href") === "#" + active.id;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateContents);
    }
  }, { passive: true });
  window.addEventListener("resize", updateContents);
  updateContents();
}
