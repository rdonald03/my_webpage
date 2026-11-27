/* =========================================================================
   PROJECT SCRIPT — shared by projects.html and every individual project page.
   ========================================================================= */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// ================= Page title: letters rise in one after another (same as the other pages) =================
// The whole title always takes about as long as "Ryan Donald" on the homepage,
// however many letters it has.
// Any formatting inside the title is kept, e.g. <i>Corvus</i> stays in italics.
const title = document.getElementById("title");
if (title) {
  const letters = [];

  // Replace every piece of text in the title with one <span> per letter
  (function wrapLetters(node) {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        const pieces = document.createDocumentFragment();
        [...child.textContent].forEach(character => {
          const span = document.createElement("span");
          span.className = "letter";
          span.textContent = character;
          span.setAttribute("aria-hidden", "true");
          letters.push(span);
          pieces.appendChild(span);
        });
        child.replaceWith(pieces);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        wrapLetters(child);   // e.g. the letters inside <i>...</i>
      }
    });
  })(title);

  title.setAttribute("aria-label", title.textContent.trim());   // screen readers still read it as one phrase
  const delayPerLetter = Math.min(0.1, 0.4 / Math.max(letters.length - 1, 1));
  letters.forEach((span, index) => { span.style.animationDelay = (index * delayPerLetter) + "s"; });
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
