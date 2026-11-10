/*
 * Reveal-the-page safety net (all pages)
 * --------------------------------------
 * Every page starts hidden (CSS: body { visibility: hidden }) and GSAP, loaded from a CDN, reveals it.
 * If that script is blocked, offline or slow to fail, the page would stay blank. Once the page has
 * finished loading, give GSAP a moment, then reveal the page anyway.
 */
(function () {
  "use strict";
  function reveal() {
    if (window.getComputedStyle(document.body).visibility === "hidden") {
      document.body.style.visibility = "visible";
    }
  }
  window.addEventListener("load", function () {
    window.setTimeout(reveal, 2500);
  });
})();
