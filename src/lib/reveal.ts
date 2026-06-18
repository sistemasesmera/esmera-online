// Scroll-reveal: fades/slides [data-reveal] elements in as they enter the viewport.
// Runs on `astro:page-load` (fires on first load + every View Transitions navigation)
// instead of DOMContentLoaded, since <main> is swapped on each client-side nav.

let observer: IntersectionObserver | null = null;

function initReveal() {
  observer?.disconnect();

  const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer?.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
  );

  elements.forEach((el) => observer?.observe(el));
}

document.addEventListener("astro:page-load", initReveal);
