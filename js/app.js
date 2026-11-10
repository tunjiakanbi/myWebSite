// =============================================================================
// app.js - shared by every page: mobile menu + GSAP intro animations
// (Gallery page behaviour lives in js/gallery.js)
// Unused / retired code is kept, commented out, at the bottom of this file.
// =============================================================================

// ----------------------------------------------------------------- elements
const body = document.querySelector("body");
const hamburger = document.querySelector("div#hamburger");
const landing = document.querySelector("div#landing");
const links = document.querySelectorAll("#landing ul#nav-links li");
const bar1 = document.querySelector("section.bars:nth-child(1)");
const bar2 = document.querySelector("section.bars:nth-child(2)");
const bar3 = document.querySelector("section.bars:nth-child(3)");
const uiUx = document.querySelector("h1.job-roles:nth-child(1");
const fEd = document.querySelector("h1.job-roles:nth-child(2");
const fSd = document.querySelector("h1.job-roles:nth-child(3");
const block2 = document.querySelector("#block-2");
const block5 = document.querySelector("#block-5");
const block6 = document.querySelector("#block-6");
const block7 = document.querySelector("#block-7");
const block8 = document.querySelector("#block-8");
const block9 = document.querySelector("#block-9");
const block10 = document.querySelector("#block-10");
const block11 = document.querySelector("#block-11");
const torqoise = document.querySelector("#torqoise-hatch");
const whiteDots = document.querySelector("#white-dots");
const whiteDots2 = document.querySelector("#white-dots2");
const goldHatch = document.querySelector("#gold-hatch");
const smallCircles = document.querySelector("#small-circles");
const smallCircles2 = document.querySelector("#small-circles2");
const whiteLine = document.querySelector("#white-line");
const whiteLine2 = document.querySelector("#white-line2");
const largeCircles = document.querySelector("#large-circles");
const largeCircles2 = document.querySelector("#large-circles2");
const goldDots = document.querySelector("#gold-dots");
const goldDots2 = document.querySelector("#gold-dots2");
const whiteDots3 = document.querySelector("#white-dots3");
const torqoise2 = document.querySelector("#torqoise-hatch2");
const goldHatch3 = document.querySelector("#gold-hatch3");
const smallCircles3 = document.querySelector("#small-circles3");
const scrollIndicator = document.getElementById("scroll-indicator");
const scrollHeading = document.querySelector("#scrollHeading");
const scrollDownChevron = document.getElementById("down-chevron");

// ----------------------------------------------------------------- mobile menu
// Accessibility: the hamburger is a <div>, so give it button semantics and keyboard support,
// and keep the closed overlay's links out of the tab order.
hamburger.setAttribute("role", "button");
hamburger.setAttribute("tabindex", "0");
hamburger.setAttribute("aria-label", "Menu");
hamburger.setAttribute("aria-controls", "landing");
function syncMenuA11y() {
  const open = landing.classList.contains("open");
  hamburger.setAttribute("aria-expanded", open ? "true" : "false");
  landing.inert = !open;
}
syncMenuA11y();
hamburger.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    hamburger.click();
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && landing.classList.contains("open")) {
    hamburger.click();
    hamburger.focus();
  }
});

hamburger.addEventListener("click", () => {
  landing.classList.toggle("open");
  links.forEach((link) => {
    link.classList.toggle("fade");
  });
  bar1.classList.toggle("bar1");
  bar2.classList.toggle("bar2");
  bar3.classList.toggle("bar3");
  syncMenuA11y();
});

// ----------------------------------------------------------------- animations: setup
// GSAP 3.15.1 + plugins are self-hosted in /js (see the <script> tags at the end of each page).
gsap.registerPlugin(SplitText, ScrollTrigger, DrawSVGPlugin);
let elemLoaded = false;
const isHomePage = body.classList.contains("page-home");

function init() {
  gsap.from(body, {autoAlpha: 0, duration: 0.25});
  if (isHomePage) {
    homeIntro();
  } else {
    pageIntro();
  }
}

// ----------------------------------------------------------------- home page intro (~4 seconds)
// One timeline, four labelled beats:   roles -> grid -> decor -> settle
// To retime the intro, change the label positions (seconds) below - nothing else needs editing.
const INTRO = {
  roles: 0.15,  // job titles start
  grid: 0.9,    // colour blocks start
  decor: 1.5,   // dots, hatches, lines and circles start
};

function homeIntro() {
  const roles = [uiUx, fEd, fSd].filter(Boolean);
  const blocks = [block2, block5, block6, block7, block8, block9, block10, block11].filter(Boolean);
  // where each decoration slides in from (px). Short hops, so the whole intro stays brief.
  const decor = [
    { el: torqoise, x: -60 },
    { el: whiteDots, x: 120 },
    { el: goldHatch, y: 120 },
    { el: smallCircles, y: 120 },
    { el: goldDots, x: 120, ease: "back.out(1.6)" },
    { el: whiteLine, x: -160 },
    { el: smallCircles2, y: 120 },
    { el: whiteLine2, x: -160 },
    { el: whiteDots2, x: 120 },
    { el: smallCircles3, y: 80 },
    { el: goldHatch3, x: 80 },
    { el: whiteDots3, x: 120 },
    { el: torqoise2, x: -60 },
    { el: goldDots2, x: 120, ease: "back.out(1.6)" },
  ].filter((d) => d.el);
  const circles = [largeCircles, largeCircles2].filter(Boolean);
  const isShown = (el) => getComputedStyle(el).display !== "none";

  // gsap.matchMedia() picks the right version for the visitor and cleans up if the setting changes
  const mm = gsap.matchMedia();
  mm.add(
    {
      motion: "(prefers-reduced-motion: no-preference)",
      reduce: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
      // Decorations that are display:none at this screen size are simply made visible,
      // so they are there if the window is resized to a layout that shows them.
      const shownDecor = decor.filter((d) => isShown(d.el));
      const shownCircles = circles.filter(isShown);
      const notShown = [...decor.map((d) => d.el), ...circles].filter((el) => !isShown(el));
      if (notShown.length) gsap.set(notShown, { autoAlpha: 1 });

      // ---- visitors who asked their device for less motion: one quick fade, nothing moves or loops
      if (context.conditions.reduce) {
        gsap.set("#scrollHeading", { animation: "none" });
        gsap.fromTo(
          [...blocks, ...shownDecor.map((d) => d.el), ...shownCircles, "#scroll-indicator-div"],
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.4, ease: "none" }
        );
        return;
      }

      // ---- the intro
      const tl = gsap.timeline({ defaults: { duration: 0.6, ease: "power3.out" } });
      tl.addLabel("roles", INTRO.roles).addLabel("grid", INTRO.grid).addLabel("decor", INTRO.decor);

      // background settles in from the nav colour
      tl.from("#container1", { backgroundColor: "#170046", duration: 1.2, ease: "power2.inOut" }, 0);

      // 1. roles: each title is revealed once, letter by letter, then stays readable
      roles.forEach((heading, i) => {
        const split = SplitText.create(heading, { type: "words, chars" });
        tl.from(split.chars, { autoAlpha: 0, yPercent: 50, duration: 0.45, stagger: 0.02 }, "roles+=" + i * 0.28);
      });

      // 2. grid: the colour blocks pop in from the middle outwards
      tl.fromTo(
        blocks,
        { autoAlpha: 0, scale: 0 },
        { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)", stagger: { each: 0.06, from: "center" }, clearProps: "transform" },
        "grid"
      );

      // 3. decor: each piece slides a short way into place
      shownDecor.forEach((d, i) => {
        tl.fromTo(
          d.el,
          { autoAlpha: 0, x: d.x || 0, y: d.y || 0 },
          { autoAlpha: 1, x: 0, y: 0, duration: 0.7, ease: d.ease || "power3.out", clearProps: "transform" },
          "decor+=" + i * 0.09
        );
      });
      //    ...while the large circle outlines draw themselves and their markers pop on
      if (shownCircles.length) {
        const rings = shownCircles.flatMap((svg) => gsap.utils.toArray("circle.cls-1", svg));
        const markers = shownCircles.flatMap((svg) => gsap.utils.toArray("circle.cls-2", svg));
        tl.set(shownCircles, { autoAlpha: 1 }, "decor+=0.2");
        tl.from(rings, { drawSVG: 0, duration: 1.3, ease: "power2.inOut", stagger: 0.12 }, "decor+=0.2");
        tl.from(markers, { scale: 0, transformOrigin: "50% 50%", duration: 0.4, ease: "back.out(2)", stagger: 0.12 }, "decor+=1.1");
      }

      // 4. settle: the scroll cue arrives last, once there is something to scroll past
      tl.addLabel("settle", "-=0.3");
      tl.fromTo("#scroll-indicator-div", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0 }, "settle");

      // ---- ambient motion (keeps going after the intro, but only while the hero is on screen)
      const ambient = [
        gsap.to("#big-c", { rotation: 360, transformOrigin: "center", repeat: -1, duration: 10, ease: "none" }),
        gsap.to("#small-c", { rotation: -360, transformOrigin: "center", repeat: -1, duration: 6, ease: "none" }),
        gsap.to(scrollDownChevron, { y: -8, duration: 0.6, ease: "sine.inOut", yoyo: true, repeat: -1 }),
      ];
      ScrollTrigger.create({
        trigger: "#container1",
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => ambient.forEach((tween) => tween.paused(!self.isActive)),
      });
    }
  );

  // hover: decorations grow slightly
  elemLoaded = true;
  [torqoise, whiteDots, goldHatch, goldDots, smallCircles].forEach(changeScale);

  // scroll cue hides once you start scrolling and returns near the top
  // (a plain fade, without the 20px slide, for visitors who prefer reduced motion)
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const indicatorTween = gsap.to(scrollIndicator, {
    autoAlpha: 0,
    ...(reduceMotion ? {} : { y: 20 }),
    duration: 0.25,
    paused: true
  });
  ScrollTrigger.create({
    start: 0,      // start watching immediately
    end: 99999,    // whole page
    onUpdate: (self) => {
      if (self.direction === 1 && self.scroll() > 50) {
        // scrolling down past 50px: hide
        indicatorTween.play();
      } else if (self.direction === -1 && self.scroll() < 200) {
        // scrolling up near top again: show
        indicatorTween.reverse();
      }
    }
  });
}

// ----------------------------------------------------------------- about / contact / gallery intro
// The original sequence, unchanged in timing. Helpers skip elements a page does not have.
function pageIntro() {
  // Block1X or Y(elem, x or yPos, dur, delay, ease, autoAlpha)
  bGFadeIn("#container1");

  splitText2("#about-description", 0.5, 1.5, 0.2);
  Block1Y(block2, -100, 0.5, 4, "power4.out", 0);
  Block1X(block5, -100, 0.5, 4.5, "power4.out", 0);
  Block1X(block6, 100, 0.5, 4.75, "power4.out", 0);
  Block1X(block7, -100, 0.5, 5, "power4.out", 0);
  Block1Y(block8, 100, 0.5, 5.25, "power4.out", 0);
  Block1X(block9, 100, 0.5, 5.5, "power4.out", 0);
  Block1X(block10, 100, 0.5, 6, "power4.out", 0);
  Block1Y(block11, 100, 0.5, 6.25, "power4.out", 0);
  Block1X(torqoise, -100, 0.5, 6.5, "power4.out", 0);
  Block1X(whiteDots, 800, 0.5, 7, "power4.out", 0);
  Block1Y(goldHatch, 800, 0.75, 7.5, "power4.out", 0);
  Block1Y(smallCircles, 800, 1, 8, "power4.out", 0);
  Block1X(goldDots, 800, 1, 8.25, "elastic.inOut", 0);
  Block1X(whiteLine, -800, 1, 8.75, "elastic.inOut", 0);
  Block1X(largeCircles, 800, 1, 9.25, "power4.out", 0);
  Block1Y(smallCircles2, 800, 1, 9.5, "power4.out", 0);
  Block1X(whiteLine2, -800, 1, 9, "elastic.inOut", 0);
  Block1X(whiteDots2, 800, 0.5, 10, "power4.out", 0);
  Block1X(largeCircles2, -800, 1, 10.25, "power4.out", 0);
  Block1Y(smallCircles3, 400, 1, 10.75, "power4.out", 0);
  Block1X(goldHatch3, 400, 1, 10.75, "power4.out", 0);
  Block1X(whiteDots3, 800, 0.5, 11, "power4.out", 0);
  Block1X(torqoise2, -100, 0.5, 11.25, "power4.out", 0);
  Block1X(goldDots2, 800, 1, 11.5, "elastic.inOut", 0);
  rotateCircles();
  elemLoaded = true;
  changeScale(torqoise);
  changeScale(whiteDots);
  changeScale(goldHatch);
  changeScale(goldDots);
  changeScale(smallCircles);
}

// ----------------------------------------------------------------- animation helpers
function changeScale(elem) {
  if (!elem) return;
  if (elemLoaded === true) {
    elem.addEventListener("mouseenter", (e) => {
      gsap.to(elem, { transformOrigin: "bottom center", scale: 1.2, duration: 0.25, ease: "power4.inOut" });
    });
    elem.addEventListener("mouseleave", (e) => {
      gsap.to(elem, { scale: 1, duration: 0.25, ease: "power4.inOut" });
    });
  }
}

function bGFadeIn(a) {
  gsap.from(a, {
    backgroundColor: "#170046",
    duration: 5,
    ease: "power4.inOut",
    delay: 1,
  });
}
function splitText2(a, b, c, d) {
  if (!document.querySelector(a)) return;
  let split = new SplitText(a, { type: "words" });
  gsap.from(split.words, {
    duration: c,//0.175
    opacity: 0,
    stagger: d,
    ease: "back",
    delay: b,
    repeat: -1,
  });
}
function Block1Y(elem, yPos, dur, delay, ease, autoAlpha) {
  if (!elem) return;
  gsap.from(elem, {
    y: yPos,
    autoAlpha: autoAlpha,
    duration: dur, //0.55
    delay: delay,
    ease: ease, //"elastic.inOut"
  });
}
function Block1X(elem, xPos, dur, delay, ease, autoAlpha) {
  if (!elem) return;
  gsap.from(elem, {
    x: xPos,
    autoAlpha: autoAlpha,
    duration: dur, //0.55
    delay: delay,
    ease: ease, //"elastic.inOut"
  });
}

function rotateCircles() {
  gsap.to("#big-c", {
    rotation: 360,
    transformOrigin: "center",
    repeat: -1,
    duration: 10, // Adjust duration as needed
  });
  gsap.to("#small-c", {
    rotation: -360,
    transformOrigin: "center",
    repeat: -1,
    duration: 6, // Adjust duration as needed
  });
}

// ----------------------------------------------------------------- start
document.addEventListener("DOMContentLoaded", init);


// =============================================================================
// UNUSED CODE - kept for reference, not running
// Each block notes where it used to sit. Nothing above depends on any of it.
// =============================================================================

// --- (elements) constants that nothing uses any more.
//     gridBlock was only passed to the changeBlock() call below, which is itself commented out.
//     colorBlocks / blockColors were never referenced. (If you revive blockColors: "ffffff" and
//     "080909" are missing their leading #.)
// const gridBlock = document.querySelector("#block-grid");
// const colorBlocks = [block2, block5, block6, block7, block8, block9, block10, block11];
// const blockColors = ["#ebf3cd", "#64a7e9", "#66a293", "#66d6d4", "#707070", "ffffff", "#170046", "080909"];

// --- (elements) earlier way of selecting the scroll heading
// const scrollHeading = document.getElementById("scrollHeading");

// --- (after the element list) hiding the large circles up front, and a debug log
// gsap.set("#large-circles", {opacity: 0});
// gsap.set("#large-circles2", {opacity: 0});
// console.log(scrollDownChevron);

// --- (mobile menu) meant to close the menu when one of its links is clicked.
//     It never ran: the "if" is checked once, at page load, when the menu is always closed,
//     so the click handlers were never attached.
// if (landing.classList.contains("open")) {
//   links.forEach((link) => {
//     link.addEventListener("click", () => {
//       landing.classList.toggle("open");
//       bar1.classList.toggle("bar1");
//       bar2.classList.toggle("bar2");
//       bar3.classList.toggle("bar3");
//     })
//   });
// }

// --- (after init) hover effect for the block grid: the call was already commented out,
//     which left the changeBlock function with no callers.
// changeBlock(gridBlock, 1.5, 1.25);
//
// //only for the grid block
// function changeBlock(elem, scale1, scale2) {//1.2, 1
//   if (elemLoaded === true) {
//     elem.addEventListener("mouseenter", (e) => {
//       gsap.to(elem, { z: 100,transformOrigin: "center center", scale: scale1, duration: 0.25, ease: "power4.inOut" });
//       // gsap.to(block2, {background: "$green", duration: 1});
//     });
//     elem.addEventListener("mouseleave", (e) => {
//       gsap.to(elem, { scale: scale2, duration: 0.25, ease: "power4.inOut" });
//       // gsap.to(block2, {background: "white", duration: 1});
//     });
//   }
// }

// --- (animation helpers) alternative settings that were commented out inside the tweens
// bGFadeIn      ->  autoAlpha: 0,
// splitText2    ->  yoyo: true
// Block1Y       ->  ease: "bounce.out"      repeat: -1,      yoyo: true
// Block1X       ->  ease: "bounce.out"      repeat: -1,      yoyo: true

// --- (start) earlier trigger for init
// window.addEventListener("load", init);

// --- (end of file) lenis for smooth scrolling
// const lenis = new Lenis()
//
// function raf(time) {
// lenis.raf(time)
// requestAnimationFrame(raf)
// }
//
// requestAnimationFrame(raf)

// --- (home intro) the previous home page intro, replaced by homeIntro() above.
//     It ran inside the shared init(): every step had its own hand-set delay (about 12.5s in
//     total) and the job titles looped forever instead of settling. The block/decoration steps
//     of that sequence are still in use, unchanged, as pageIntro() for the other pages.
// splitText(uiUx, 0.5);
// splitText(fEd, 1.5);
// splitText(fSd, 3);
// //scroll indicator animation
// gsap.fromTo("#scroll-indicator-div",
//   {autoAlpha: 0, y: 20},
//   {autoAlpha: 1, y: 0, duration: 1, ease: "power4.out", delay: 4}
// );
// splitText(scrollHeading, 0.5);
//
// function splitText(a, b) {
//   let split = new SplitText(a, { type: "chars" });
//   gsap.from(split.chars, {
//     duration: 0.175,
//     opacity: 0,
//     stagger: 0.1,
//     ease: "back",
//     delay: b,
//     repeat: -1,
//     yoyo: true
//   });
// }

// --- (setup) plugins that used to be registered but were never used.
//     GSDevTools is a development tool and should not ship; to use it while tuning the intro, add
//     <script src="js/GSDevTools.min.js"></script> and  GSDevTools.create({ animation: tl })
// gsap.registerPlugin(GSDevTools, SplitText, TextPlugin, ScrollTrigger);

// --- (start) note to self
// //note to self, re-order sequence of animations, and introduce timelines and ,aster timelines
//     (done for the home page: see homeIntro)
