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
const uiUx = document.querySelector(".job-roles:nth-child(1)");
const fEd = document.querySelector(".job-roles:nth-child(2)");
const fSd = document.querySelector(".job-roles:nth-child(3)");
const block2 = document.querySelector("#block-2");
const block5 = document.querySelector("#block-5");
const block6 = document.querySelector("#block-6");
const block7 = document.querySelector("#block-7");
const block8 = document.querySelector("#block-8");
const block9 = document.querySelector("#block-9");
const block10 = document.querySelector("#block-10");
const block11 = document.querySelector("#block-11");
let torqoise = document.querySelector("#torqoise-hatch");
let whiteDots = document.querySelector("#white-dots");
let whiteDots2 = document.querySelector("#white-dots2");
let goldHatch = document.querySelector("#gold-hatch");
const smallCircles = document.querySelector("#small-circles");
const smallCircles2 = document.querySelector("#small-circles2");
const whiteLine = document.querySelector("#white-line");
const whiteLine2 = document.querySelector("#white-line2");
const largeCircles = document.querySelector("#large-circles");
const largeCircles2 = document.querySelector("#large-circles2");
let goldDots = document.querySelector("#gold-dots");
let goldDots2 = document.querySelector("#gold-dots2");
let whiteDots3 = document.querySelector("#white-dots3");
let torqoise2 = document.querySelector("#torqoise-hatch2");
let goldHatch3 = document.querySelector("#gold-hatch3");
const smallCircles3 = document.querySelector("#small-circles3");
const scrollIndicator = document.getElementById("scroll-indicator");
const scrollHeading = document.querySelector("#scrollHeading");
const scrollDownChevron = document.getElementById("down-chevron");

// ----------------------------------------------------------------- nav: hides going down, returns going up
// The nav bar is pinned to the top of the window (position: sticky in style.scss). Scrolling down
// slides it out of the way; scrolling up, even a little, brings it straight back, so the menu is
// always one small scroll away. It always shows near the top of the page, while the menu is open
// and when a keyboard user tabs into it. style.scss does the sliding from html.nav-hidden.
const NAV_SCROLL = {
  showAbove: 80, // px from the top of the page: always shown
  down: 8,       // px scrolled down before it hides
  up: 4,         // px scrolled up before it returns
};
(function navOnScroll() {
  const root = document.documentElement;
  const nav = document.querySelector("nav");
  if (!nav) return;
  let last = Math.max(0, window.scrollY);
  let queued = false;
  const show = () => root.classList.remove("nav-hidden");
  const update = () => {
    queued = false;
    const y = Math.max(0, window.scrollY); // (ignores the bounce past the top on phones)
    const moved = y - last;
    if (y <= NAV_SCROLL.showAbove || root.classList.contains("menu-open")) show();
    else if (moved > NAV_SCROLL.down) root.classList.add("nav-hidden");
    else if (moved < -NAV_SCROLL.up) show();
    else return; // too small to count yet: keep measuring from the same place
    last = y;
  };
  window.addEventListener("scroll", () => {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }, { passive: true });
  nav.addEventListener("focusin", show);
})();

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
  // stop the page behind the open menu from scrolling
  document.documentElement.classList.toggle("menu-open", open);
}
syncMenuA11y();
// The menu button is hidden from 1366px. If the window is widened past that while the menu is
// open, close the menu, otherwise it would be left covering the page with no way to close it.
window.matchMedia("(min-width: 1366px)").addEventListener("change", (e) => {
  if (e.matches && landing.classList.contains("open")) hamburger.click();
});
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
  // (the bars turn into the close button in the stylesheet, from aria-expanded)
  syncMenuA11y();
});

// Back and Forward: browsers restore the previous page from memory exactly as it was left. If a
// page was left by choosing a link in the open menu, it would come back with the menu still
// covering it. So the menu is closed, instantly, as the page is left (the copy the browser keeps
// then has it closed), and checked again when a page is restored, since browsers take that copy
// at slightly different moments.
function resetMenu() {
  const root = document.documentElement;
  if (landing.classList.contains("open")) {
    root.classList.add("menu-instant"); // style.scss: no transitions in the nav while this is set
    landing.classList.remove("open");
    links.forEach((link) => link.classList.remove("fade"));
    syncMenuA11y();
    void landing.offsetWidth; // apply the closed state now, without animating
  }
  // back to normal (animated) behaviour once the closed state has been drawn
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("menu-instant")));
}
window.addEventListener("pagehide", resetMenu);
window.addEventListener("pageshow", (e) => {
  if (e.persisted) resetMenu();
});

// ----------------------------------------------------------------- animations: setup
// GSAP 3.15.1 + plugins are self-hosted in /js (see the <script> tags at the end of each page).
gsap.registerPlugin(SplitText, ScrollTrigger, DrawSVGPlugin);

function init() {
  gsap.from(body, {autoAlpha: 0, duration: 0.25});
  // the dot grids and hatches are swapped for inline SVG first (see inlineDecor), so their
  // individual dots and stripes can be animated; if that fails the animations still run
  const start = () => {
    heroIntro();
    sectionColors();
    aboutColor();
    flushRules();
    projectReveals();
    decorDrift();
    pageArrive();
    aboutReveals();
    decorHover();
    // These start a moment after the page begins loading (see inlineDecor), so measure the page
    // again once everything, images included, has loaded.
    if (document.readyState === "complete") ScrollTrigger.refresh();
    else window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
  };
  inlineDecor().then(start, start);
}

// ----------------------------------------------------------------- decorations: inline SVG
// The dot grids and hatches are <img> tags in the HTML. An <img> can only be animated as a whole,
// so the SVG drawing is fetched (it is already in the browser cache) and put in the page in place
// of the <img>, keeping its id, classes and size. Then every dot and stripe is its own element.
// If this cannot happen (slow network, or the page opened straight from disk without a server),
// the <img> tags stay and each decoration is animated as one piece, exactly as before.
const DECOR_FILES = /(white-dots|gold-dots|torqoise-hatch|gold-hatch)\.svg$/;
const DECOR_WAIT = 600; // ms: never hold the intro up for longer than this

function inlineDecor() {
  const imgs = gsap.utils.toArray("img").filter((img) => DECOR_FILES.test(img.getAttribute("src") || ""));
  if (!imgs.length || !window.fetch || !window.DOMParser) return Promise.resolve();
  // Only when the stylesheet is the version that positions inline <svg> decorations (it says so
  // with --decor-inline). With an older style.css - a cached copy, or one not uploaded yet - the
  // <img> tags must stay, or the decorations would lose their positions.
  if (getComputedStyle(document.documentElement).getPropertyValue("--decor-inline").trim() !== "1") return Promise.resolve();
  const files = [...new Set(imgs.map((img) => img.getAttribute("src")))];
  const load = Promise.all(
    files.map((src) => fetch(src).then((r) => (r.ok ? r.text() : Promise.reject(new Error(src)))).then((text) => [src, text]))
  ).then((pairs) => {
    const source = new Map(pairs);
    imgs.forEach((img, n) => {
      const doc = new DOMParser().parseFromString(source.get(img.getAttribute("src")), "image/svg+xml");
      const svg = doc.documentElement;
      if (!svg || svg.nodeName.toLowerCase() !== "svg") return;
      // ids inside the file would repeat across copies: drop them, and give the clip its own name
      const clipId = "decor-clip-" + n;
      svg.querySelectorAll("[id]").forEach((el) => {
        if (el.nodeName.toLowerCase() === "clippath") el.id = clipId;
        else el.removeAttribute("id");
      });
      svg.querySelectorAll("[clip-path]").forEach((el) => el.setAttribute("clip-path", "url(#" + clipId + ")"));
      svg.querySelectorAll("[data-name]").forEach((el) => el.removeAttribute("data-name"));
      svg.removeAttribute("data-name");
      // size like the <img> did: the file's width is the default, and the height follows the
      // width (whatever the stylesheet sets it to) in the drawing's own proportions
      const w = parseFloat(svg.getAttribute("width")), h = parseFloat(svg.getAttribute("height"));
      svg.removeAttribute("height");
      if (w && h) svg.style.aspectRatio = w + " / " + h;
      svg.id = img.id;
      svg.setAttribute("class", (img.className + " decor-inline").trim());
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("focusable", "false");
      svg.setAttribute("data-decor", /dots/.test(img.getAttribute("src")) ? "dots" : "hatch");
      img.replaceWith(document.importNode(svg, true));
    });
    // the element references made at the top of this file now point at the new elements
    torqoise = document.querySelector("#torqoise-hatch");
    whiteDots = document.querySelector("#white-dots");
    whiteDots2 = document.querySelector("#white-dots2");
    goldHatch = document.querySelector("#gold-hatch");
    goldDots = document.querySelector("#gold-dots");
    goldDots2 = document.querySelector("#gold-dots2");
    whiteDots3 = document.querySelector("#white-dots3");
    torqoise2 = document.querySelector("#torqoise-hatch2");
    goldHatch3 = document.querySelector("#gold-hatch3");
  });
  let late = false;
  const timeout = new Promise((resolve) => setTimeout(() => { late = true; resolve(); }, DECOR_WAIT));
  // if the files arrive after the intro has started, leave the <img> tags alone
  return Promise.race([load.then(() => {}, () => {}), timeout]);
}

// The dots or stripes inside an inlined decoration ([] for a plain <img>).
function decorPieces(el) {
  if (!el || !el.matches || !el.matches("svg.decor-inline")) return [];
  return gsap.utils.toArray(el.getAttribute("data-decor") === "dots" ? "circle" : "path", el);
}

// Adds a decoration's arrival to a timeline: dot grids fill in as a wave from the top-left corner,
// hatch stripes slide in one after another. A plain <img> slides in whole from (x, y) instead.
function decorArrive(tl, el, at, slide) {
  const pieces = decorPieces(el);
  if (!pieces.length) {
    tl.fromTo(
      el,
      { autoAlpha: 0, x: slide.x || 0, y: slide.y || 0 },
      { autoAlpha: 1, x: 0, y: 0, duration: 0.7, ease: slide.ease || "power3.out", clearProps: "transform" },
      at
    );
    return;
  }
  tl.set(el, { autoAlpha: 1 }, at);
  if (el.getAttribute("data-decor") === "dots") {
    tl.from(
      pieces,
      { scale: 0, transformOrigin: "50% 50%", duration: 0.35, ease: "back.out(2)", stagger: { amount: 0.6, grid: "auto", from: "start" } },
      at
    );
  } else {
    tl.from(pieces, { autoAlpha: 0, y: 60, duration: 0.5, ease: "power3.out", stagger: 0.09 }, at);
  }
}

// ----------------------------------------------------------------- page intro (~4 seconds, every page)
// One timeline, four labelled beats:   roles -> grid -> decor -> settle
// Every page uses it; each beat simply skips what a page does not have (only the home page has
// role titles and a scroll cue, the About page shows its decoration only on desktop).
// To retime the intro, change the label positions (seconds) below - nothing else needs editing.
const INTRO = {
  roles: 0.15,  // job titles start
  grid: 0.9,    // colour blocks start
  decor: 1.5,   // dots, hatches, lines and circles start
};

function heroIntro() {
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
  const hero = document.querySelector("#container1");
  const scrollCue = document.querySelector("#scroll-indicator-div");
  // "shown" = takes up space on the page (false for display:none on the element or any parent)
  const isShown = (el) => el.getClientRects().length > 0;

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
        if (scrollHeading) gsap.set(scrollHeading, { animation: "none" });
        gsap.fromTo(
          [...blocks, ...shownDecor.map((d) => d.el), ...shownCircles, scrollCue].filter(Boolean),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.4, ease: "none" }
        );
        return;
      }

      // ---- the intro
      const tl = gsap.timeline({ defaults: { duration: 0.6, ease: "power3.out" } });
      tl.addLabel("roles", INTRO.roles).addLabel("grid", INTRO.grid).addLabel("decor", INTRO.decor);

      // background settles in from the nav colour (skipped where the hero has no colour of its own,
      // as on the About page, whose decoration field is see-through)
      const heroStyle = hero ? getComputedStyle(hero) : null;
      const heroHasColor = heroStyle && !/^rgba\(0, 0, 0, 0\)$|^transparent$/.test(heroStyle.backgroundColor);
      if (heroHasColor) tl.from(hero, { backgroundColor: "#170046", duration: 1.2, ease: "power2.inOut" }, 0);

      // 1. roles: each title is revealed once, letter by letter, then stays readable
      roles.forEach((heading, i) => {
        const split = SplitText.create(heading, { type: "words, chars" });
        tl.from(split.chars, { autoAlpha: 0, yPercent: 50, duration: 0.45, stagger: 0.02 }, "roles+=" + i * 0.28);
      });

      // 2. grid: the colour blocks pop in from the middle outwards
      if (blocks.length) tl.fromTo(
        blocks,
        { autoAlpha: 0, scale: 0 },
        { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)", stagger: { each: 0.06, from: "center" }, clearProps: "transform" },
        "grid"
      );

      // 3. decor: each decoration arrives in turn
      //    (dot grids fill in dot by dot and hatches stripe by stripe: see decorArrive)
      shownDecor.forEach((d, i) => decorArrive(tl, d.el, "decor+=" + i * 0.09, d));
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
      if (scrollCue) tl.fromTo(scrollCue, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0 }, "settle");

      heroIntroLength = tl.duration();

      // ---- ambient motion (keeps going after the intro, but only while the hero is on screen)
      const ambient = [];
      if (document.querySelector("#big-c")) {
        ambient.push(gsap.to("#big-c", { rotation: 360, transformOrigin: "center", repeat: -1, duration: 10, ease: "none" }));
        ambient.push(gsap.to("#small-c", { rotation: -360, transformOrigin: "center", repeat: -1, duration: 6, ease: "none" }));
      }
      if (scrollDownChevron) {
        ambient.push(gsap.to(scrollDownChevron, { y: -8, duration: 0.6, ease: "sine.inOut", yoyo: true, repeat: -1 }));
      }
      // (a hero that stays on screen - position: sticky on the About page - never needs pausing)
      if (hero && ambient.length && heroStyle.position !== "sticky") {
        ScrollTrigger.create({
          trigger: hero,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => ambient.forEach((tween) => tween.paused(!self.isActive)),
        });
      }
    }
  );

  // (hover on the decorations: see decorHover)

  // scroll cue hides once you start scrolling and returns near the top
  // (a plain fade, without the 20px slide, for visitors who prefer reduced motion)
  if (!scrollIndicator) return;
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

// ----------------------------------------------------------------- home: section colours on scroll
// As you scroll from the hero into the projects, and from one project to the next, each project
// section arrives in a contrasting palette colour and resolves to its own background colour.
//
//   * The destination is always whatever the stylesheet says (read at run time), so changing a
//     section's background in style.scss needs no change here.
//   * "from" is the colour a section starts on. Sea blue, green, torqoise and gold keep the white,
//     torqoise and gold text readable for the whole change; lime and white do not.
//   * The change is tied to scroll (scrub). It starts when the section's top edge enters the
//     bottom of the screen. It is timed so that the colour is always SECTION_COLOR_AT_TEXT of the
//     way to its destination at the moment the section's text first appears - on every screen
//     size, whatever the height of the project image - and it finishes a little further on.
const SECTION_COLORS = [
  { section: "#container2.projects", from: "#64a7e9" }, // hero -> GPT-3              ($seaBlue)
  { section: "#container3.projects", from: "#66d6d4" }, // GPT-3 -> Everyday Things   ($torqoise)
  { section: "#container4.projects", from: "#66a293" }, // Everyday Things -> Jottly  ($green)
];
const SECTION_COLOR_AT_TEXT = 0.65; // 0.65 = 65% changed when the text scrolls into view (raise for a quicker change)

function sectionColors() {
  const mm = gsap.matchMedia();
  // visitors who prefer reduced motion simply get the final colours
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // created top to bottom, in page order
    SECTION_COLORS.forEach(({ section, from }) => {
      const el = document.querySelector(section);
      if (!el) return;
      const text = el.querySelector(".proj-details") || el;
      const to = getComputedStyle(el).backgroundColor;
      gsap.fromTo(
        el,
        { backgroundColor: from },
        {
          backgroundColor: to,
          ease: "none",
          scrollTrigger: {
            id: "color",
            trigger: el,
            start: "clamp(top bottom)",
            // distance from the section's top to its text, stretched so the text arrives at the
            // chosen point of the change; never beyond the end of the page (the last section)
            end: (self) => {
              const toText = text.getBoundingClientRect().top - el.getBoundingClientRect().top;
              return Math.min(self.start + toText / SECTION_COLOR_AT_TEXT, ScrollTrigger.maxScroll(window));
            },
            scrub: 0.3,
          },
        }
      );
    });
  });
}

// ----------------------------------------------------------------- about: bio colour on scroll
// The colour change is on the About Me section itself, not the page background: the card on
// desktop (1024px and wider) and the bio section on phones and tablets. Its text is on screen from
// the moment the page opens, so the starting colour must keep the gold, lime and white text
// readable at 0%, which rules out every light palette colour. It opens on the palette's near-black
// and warms to the stylesheet colour (the destination) over the first stretch of scrolling.
const ABOUT_COLOR_FROM = "#080909";   // $myBlack
const ABOUT_COLOR_DISTANCE = 0.6;     // finished after scrolling 60% of the screen height

function aboutColor() {
  if (!document.body.classList.contains("page-about")) return;
  const mm = gsap.matchMedia();
  // rebuilt automatically when the window crosses 1024px, so the right element is animated
  mm.add(
    { desktop: "(min-width: 1024px)", motion: "(prefers-reduced-motion: no-preference)" },
    (context) => {
      if (!context.conditions.motion) return;
      const el = document.querySelector(context.conditions.desktop ? ".about-card" : "#container2");
      if (!el) return;
      const to = getComputedStyle(el).backgroundColor;
      if (ScrollTrigger.maxScroll(window) < 100) {
        // the whole page fits on the screen, so there is nothing to scroll: play it once instead
        gsap.fromTo(el, { backgroundColor: ABOUT_COLOR_FROM }, { backgroundColor: to, duration: 1.4, delay: 0.3, ease: "power2.inOut" });
        return;
      }
      gsap.fromTo(
        el,
        { backgroundColor: ABOUT_COLOR_FROM },
        {
          backgroundColor: to,
          ease: "none",
          scrollTrigger: {
            id: "color",
            start: 0,
            end: () => Math.min(window.innerHeight * ABOUT_COLOR_DISTANCE, ScrollTrigger.maxScroll(window)),
            scrub: 0.3,
          },
        }
      );
    }
  );
}

// ----------------------------------------------------------------- home: gold rules flush with their text
// Each highlight has a gold rule on its left that must be exactly as tall as its text. The top is
// always the top of the capitals (style.scss). The bottom depends on what the last line happens
// to contain at this screen width: letters that hang below the line (g, p, y, commas, brackets)
// or not. This reads each highlight's last line and tells the stylesheet which it is.
const RULE_BOTTOM = { hanging: "0.24em", baseline: "0.45em" };
const HANGS_BELOW = /[gjpqyQ,;()]/;

function flushRules() {
  const items = gsap.utils.toArray(".proj-highlights li");
  if (!items.length) return;
  const range = document.createRange();
  const measure = () => {
    items.forEach((li) => {
      // walk back from the end of the text, collecting the characters on the last line
      const walker = document.createTreeWalker(li, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      let lastTop = null, line = "", done = false;
      for (let n = nodes.length - 1; n >= 0 && !done; n--) {
        const text = nodes[n].nodeValue;
        for (let i = text.length - 1; i >= 0; i--) {
          if (/\s/.test(text[i])) continue;
          range.setStart(nodes[n], i);
          range.setEnd(nodes[n], i + 1);
          const top = range.getBoundingClientRect().top;
          if (lastTop === null) lastTop = top;
          if (Math.abs(top - lastTop) > 4) { done = true; break; } // reached the line above
          line += text[i];
        }
      }
      li.style.setProperty("--rule-bottom", HANGS_BELOW.test(line) ? RULE_BOTTOM.hanging : RULE_BOTTOM.baseline);
    });
  };
  measure();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure); // text re-wraps when Outfit arrives
  let timer;
  window.addEventListener("resize", () => { clearTimeout(timer); timer = setTimeout(measure, 150); });
}

// ----------------------------------------------------------------- home: project reveals
// Each project is revealed once, the first time it scrolls into view (it does not replay).
// These are timed, not tied to the scrollbar, so they never fight the scroll-linked colours.
//   screenshot  rises from the bottom; on desktop it comes from the left, right, left in turn
//   title, subtitle, technologies, focus area   slide in from the left, one after another
//   overview    rises from the bottom
//   highlights  the label, then each point, rise one after another
//   button      rises from the bottom
//   divider     (desktop) draws itself left to right - style.scss reads --proj-line
//   decorations beside the project (tall desktop screens) fill in dot by dot / stripe by stripe
const REVEAL = {
  distance: 40, duration: 0.6, gap: 0.1,
  start: "top 85%",      // text block: begins when its top is 15% up the screen
  // The screenshot begins as soon as the project's top edge appears, and is quick, so it has
  // settled well before the project fills the screen (it used to wait until 20% up the screen and
  // take 0.8s, which left a tall empty space on phones, where the screenshot is most of the screen).
  shotStart: "top 96%",
  shotDuration: 0.45,
  shotDistance: 24,      // phones and tablets: rises this far
  shotSide: 48,          // desktop: slides in this far from the left or right
};

function projectReveals() {
  const projects = gsap.utils.toArray(".projects");
  if (!projects.length) return;
  const mm = gsap.matchMedia();
  mm.add(
    { desktop: "(min-width: 1024px)", motion: "(prefers-reduced-motion: no-preference)" },
    (context) => {
      if (!context.conditions.motion) return; // reduced motion: everything is simply in place
      const desktop = context.conditions.desktop;
      const ease = "power3.out";
      projects.forEach((project, i) => {
        const shot = project.querySelector("img.proj-img");
        const details = project.querySelector(".proj-details");
        if (!shot || !details) return;
        const title = details.querySelector("h2");
        const tech = details.querySelector("h3");
        const content = details.querySelector(".project-content");
        const text = content.querySelector("p");
        const button = content.querySelector(".btn");

        // 1. screenshot (its wrapper is the trigger: the screenshot itself is moved)
        const fromSide = desktop ? (i % 2 === 0 ? -1 : 1) * REVEAL.shotSide : 0;
        gsap.fromTo(
          shot,
          { autoAlpha: 0, x: fromSide, y: desktop ? 0 : REVEAL.shotDistance },
          {
            autoAlpha: 1, x: 0, y: 0, duration: REVEAL.shotDuration, ease: "power2.out", clearProps: "transform",
            scrollTrigger: { trigger: project, start: REVEAL.shotStart, once: true },
          }
        );

        // 2-6. text block
        const tl = gsap.timeline({
          defaults: { duration: REVEAL.duration, ease },
          scrollTrigger: { trigger: details, start: REVEAL.start, once: true },
        });
        // title, subtitle, technologies, focus area: from the left, one after another
        const heads = [title, details.querySelector(".proj-subtitle"), tech, details.querySelector(".proj-focus")].filter(Boolean);
        // highlights: the label, then each point
        const points = gsap.utils.toArray(".proj-highlights h4, .proj-highlights li", content);
        tl.fromTo(heads, { autoAlpha: 0, x: -REVEAL.distance }, { autoAlpha: 1, x: 0, stagger: REVEAL.gap, clearProps: "transform" }, 0)
          .fromTo(text, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, clearProps: "transform" }, REVEAL.gap * 3);
        if (points.length) tl.fromTo(points, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, stagger: REVEAL.gap, clearProps: "transform" }, REVEAL.gap * 4);
        tl.fromTo(
            button,
            { autoAlpha: 0, x: 0, y: 24 },
            // only x/y are cleared, so the button's own hover styles are untouched
            { autoAlpha: 1, x: 0, y: 0, clearProps: "transform" },
            REVEAL.gap * 5
          )
          .fromTo(content, { "--proj-line": 0 }, { "--proj-line": 1, duration: 0.8, ease: "power2.inOut", clearProps: "--proj-line" }, REVEAL.gap * 5);

        // decorations beside this project (only laid out on tall desktop screens)
        const decor = gsap.utils.toArray(":scope > img, :scope > svg", project).filter((el) => el.getClientRects().length > 0);
        decor.forEach((el, n) => {
          const dtl = gsap.timeline({ scrollTrigger: { trigger: project, start: "top 70%", once: true } });
          decorArrive(dtl, el, n * 0.15, { y: REVEAL.distance });
        });
      });
    }
  );
}

// ----------------------------------------------------------------- home: decorations drift on scroll
// Depth: as the page scrolls, each decoration moves a little slower or faster than the page
// (positive = lags behind, negative = runs ahead). Tied to the scrollbar, and only on the home
// page. It starts when the intro has finished, so the two never move the same element at once.
const DRIFT = [
  ["#torqoise-hatch", 70], ["#white-dots", -50], ["#white-dots2", 40], ["#gold-hatch", -60],
  ["#small-circles", 90], ["#small-circles2", -40], ["#gold-dots", 50], ["#white-line", -30], ["#white-line2", 30],
  ["#large-circles", 110], ["#large-circles2", -70],
  ["#gold-dots2", 60], ["#white-dots3", -50], ["#torqoise-hatch2", 80], ["#gold-hatch3", -60], ["#small-circles3", 50],
];
const DRIFT_PROJECT = 50; // decorations beside the projects: px either side of their resting place

function decorDrift() {
  if (!document.body.classList.contains("page-home")) return;
  const hero = document.querySelector("#container1");
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const build = () => {
      DRIFT.forEach(([selector, amount]) => {
        const el = document.querySelector(selector);
        if (!el || !el.getClientRects().length) return;
        gsap.to(el, { y: amount, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.4 } });
      });
      gsap.utils.toArray(".projects").forEach((project) => {
        gsap.utils.toArray(":scope > img, :scope > svg", project).forEach((el, n) => {
          if (!el.getClientRects().length) return;
          const amount = (n % 2 === 0 ? 1 : -1) * DRIFT_PROJECT;
          gsap.fromTo(el, { y: -amount }, { y: amount, ease: "none", scrollTrigger: { trigger: project, start: "top bottom", end: "bottom top", scrub: 0.4 } });
        });
      });
    };
    // wait for the intro (which also moves these elements) to finish
    const wait = gsap.delayedCall(heroIntroLength + 0.1, build);
    return () => wait.kill();
  });
}
let heroIntroLength = 0; // seconds; set by heroIntro()

// ----------------------------------------------------------------- gallery + contact: the card arrives
// The card rises in, then its contents follow one after another (0.08s apart): heading, text,
// then each category row (gallery) or each link, field and the button (contact). The gallery's
// row dividers draw left to right - style.scss reads --row-line. Plays once, on load. Nothing
// is disabled while it plays: keyboard focus and typing work from the first moment.
const ARRIVE = { delay: 0.25, rise: 24, duration: 0.5, gap: 0.08 };

function pageArrive() {
  const page = document.body.classList;
  const card = page.contains("page-gallery") ? document.querySelector("#gallery")
    : page.contains("page-contact") ? document.querySelector("section#contact") : null;
  if (!card || !card.getClientRects().length) return; // e.g. gallery opened straight into a category
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const items = page.contains("page-gallery")
      ? gsap.utils.toArray("#gallery-section > h1, #gallery-section > p, #gallery-section li.gallery-links", card)
      : gsap.utils.toArray("#contact-intro > h1, #contact-intro > .contact-lead, .contact-direct li, #myForm .field, #myForm .btn", card);
    const rows = gsap.utils.toArray("li.gallery-links", card);
    const tl = gsap.timeline({ delay: ARRIVE.delay, defaults: { duration: ARRIVE.duration, ease: "power3.out" } });
    // opacity only (never visibility: hidden), so links and fields can take focus straight away
    tl.fromTo(card, { opacity: 0, y: ARRIVE.rise }, { opacity: 1, y: 0, clearProps: "transform,opacity" }, 0)
      .fromTo(items, { opacity: 0, y: 18 }, { opacity: 1, y: 0, stagger: ARRIVE.gap, clearProps: "transform,opacity" }, 0.15);
    if (rows.length) {
      tl.fromTo(rows, { "--row-line": 0 }, { "--row-line": 1, duration: 0.6, ease: "power2.inOut", stagger: ARRIVE.gap, clearProps: "--row-line" }, 0.3);
    }
  });
}

// ----------------------------------------------------------------- about: sections reveal on scroll
// Each block of the bio is revealed once, the first time it scrolls into view (blocks already on
// screen when the page opens arrive one after another). Headings slide in from the left, text and
// list items rise, the photo fades up to size (from the right on desktop), and the rule under
// "About Me" draws left to right - style.scss reads --h1-line. The card's colour change on scroll
// (aboutColor) is separate and unchanged.
function aboutReveals() {
  if (!document.body.classList.contains("page-about")) return;
  const bio = document.querySelector("#about-left-panel");
  const photo = document.querySelector("#about-right-panel img");
  if (!bio) return;
  const mm = gsap.matchMedia();
  mm.add(
    { desktop: "(min-width: 1024px)", motion: "(prefers-reduced-motion: no-preference)" },
    (context) => {
      if (!context.conditions.motion) return;
      const headings = gsap.utils.toArray("h1, h2", bio);
      const texts = gsap.utils.toArray("p, li", bio);
      const h1 = bio.querySelector("h1");
      gsap.set(headings, { autoAlpha: 0, x: -REVEAL.distance });
      gsap.set(texts, { autoAlpha: 0, y: 24 });
      if (h1) gsap.set(h1, { "--h1-line": 0 });
      if (photo) gsap.set(photo, { autoAlpha: 0, scale: 0.96, x: context.conditions.desktop ? REVEAL.distance : 0, y: context.conditions.desktop ? 0 : 24 });
      // in page order, so blocks that arrive together are staggered top to bottom
      const all = gsap.utils.toArray("h1, h2, p, li", bio).concat(photo ? [photo] : []);
      ScrollTrigger.batch(all, {
        start: "top 88%",
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1, x: 0, y: 0, scale: 1,
            duration: REVEAL.duration, ease: "power3.out", stagger: 0.07, overwrite: true,
            clearProps: "transform",
          });
          if (h1 && batch.includes(h1)) gsap.to(h1, { "--h1-line": 1, duration: 0.8, ease: "power2.inOut", delay: 0.15, clearProps: "--h1-line" });
        },
      });
    }
  );
}

// ----------------------------------------------------------------- decorations: hover
// The same piece-by-piece motion as the intro, on every page:
//   dot grids   a ripple spreads out from where the pointer enters; each dot swells and settles
//   hatches     the stripes shift along their slant one after another, then return
//   small circles and lines (plain images) grow slightly while hovered, as they always have
// Starts once the intro has finished, and is off for reduced motion.
function decorHover() {
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    let ready = false;
    const wait = gsap.delayedCall(heroIntroLength + 0.1, () => { ready = true; });
    const off = [];
    const on = (el, type, fn) => { el.addEventListener(type, fn); off.push(() => el.removeEventListener(type, fn)); };

    gsap.utils.toArray("svg.decor-inline").forEach((svg) => {
      const pieces = decorPieces(svg);
      if (!pieces.length) return;
      const dots = svg.getAttribute("data-decor") === "dots";
      on(svg, "pointerenter", (e) => {
        if (!ready || gsap.isTweening(pieces)) return;
        if (dots) {
          // the further a dot is from the pointer, the later it swells
          const far = pieces.map((dot) => {
            const r = dot.getBoundingClientRect();
            return Math.hypot(r.left + r.width / 2 - e.clientX, r.top + r.height / 2 - e.clientY);
          });
          const max = Math.max.apply(null, far) || 1;
          gsap.to(pieces, {
            scale: 1.7, transformOrigin: "50% 50%", duration: 0.22, ease: "power2.out",
            yoyo: true, repeat: 1, delay: (i) => (far[i] / max) * 0.45,
          });
        } else {
          gsap.to(pieces, { y: -14, duration: 0.25, ease: "power2.out", yoyo: true, repeat: 1, stagger: 0.07 });
        }
      });
    });

    gsap.utils.toArray("img[id^='small-circles'], img[id^='white-line']").forEach((img) => {
      on(img, "pointerenter", () => { if (ready) gsap.to(img, { scale: 1.2, transformOrigin: "50% 50%", duration: 0.25, ease: "power2.out", overwrite: "auto" }); });
      on(img, "pointerleave", () => gsap.to(img, { scale: 1, duration: 0.25, ease: "power2.out", overwrite: "auto" }));
    });

    return () => { wait.kill(); off.forEach((fn) => fn()); };
  });
}

// ----------------------------------------------------------------- animation helpers
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

// --- (page intros) the original sequence that About, Contact and Gallery used until every page
//     moved to heroIntro(): about 12.5 seconds, a hand-set delay on every step, and no
//     reduced-motion handling. Kept with the helpers only it used.
// // ----------------------------------------------------------------- about / contact / gallery intro
// // The original sequence, unchanged in timing. Helpers skip elements a page does not have.
// function pageIntro() {
//   // Block1X or Y(elem, x or yPos, dur, delay, ease, autoAlpha)
//   bGFadeIn("#container1");
//
//   splitText2("#about-description", 0.5, 1.5, 0.2);
//   Block1Y(block2, -100, 0.5, 4, "power4.out", 0);
//   Block1X(block5, -100, 0.5, 4.5, "power4.out", 0);
//   Block1X(block6, 100, 0.5, 4.75, "power4.out", 0);
//   Block1X(block7, -100, 0.5, 5, "power4.out", 0);
//   Block1Y(block8, 100, 0.5, 5.25, "power4.out", 0);
//   Block1X(block9, 100, 0.5, 5.5, "power4.out", 0);
//   Block1X(block10, 100, 0.5, 6, "power4.out", 0);
//   Block1Y(block11, 100, 0.5, 6.25, "power4.out", 0);
//   Block1X(torqoise, -100, 0.5, 6.5, "power4.out", 0);
//   Block1X(whiteDots, 800, 0.5, 7, "power4.out", 0);
//   Block1Y(goldHatch, 800, 0.75, 7.5, "power4.out", 0);
//   Block1Y(smallCircles, 800, 1, 8, "power4.out", 0);
//   Block1X(goldDots, 800, 1, 8.25, "elastic.inOut", 0);
//   Block1X(whiteLine, -800, 1, 8.75, "elastic.inOut", 0);
//   Block1X(largeCircles, 800, 1, 9.25, "power4.out", 0);
//   Block1Y(smallCircles2, 800, 1, 9.5, "power4.out", 0);
//   Block1X(whiteLine2, -800, 1, 9, "elastic.inOut", 0);
//   Block1X(whiteDots2, 800, 0.5, 10, "power4.out", 0);
//   Block1X(largeCircles2, -800, 1, 10.25, "power4.out", 0);
//   Block1Y(smallCircles3, 400, 1, 10.75, "power4.out", 0);
//   Block1X(goldHatch3, 400, 1, 10.75, "power4.out", 0);
//   Block1X(whiteDots3, 800, 0.5, 11, "power4.out", 0);
//   Block1X(torqoise2, -100, 0.5, 11.25, "power4.out", 0);
//   Block1X(goldDots2, 800, 1, 11.5, "elastic.inOut", 0);
//   rotateCircles();
//   elemLoaded = true;
//   changeScale(torqoise);
//   changeScale(whiteDots);
//   changeScale(goldHatch);
//   changeScale(goldDots);
//   changeScale(smallCircles);
// }
//
// function bGFadeIn(a) {
//   if (!document.querySelector(a)) return;
//   gsap.from(a, {
//     backgroundColor: "#170046",
//     duration: 5,
//     ease: "power4.inOut",
//     delay: 1,
//   });
// }
// function splitText2(a, b, c, d) {
//   if (!document.querySelector(a)) return;
//   let split = new SplitText(a, { type: "words" });
//   gsap.from(split.words, {
//     duration: c,//0.175
//     opacity: 0,
//     stagger: d,
//     ease: "back",
//     delay: b,
//     repeat: -1,
//   });
// }
// function Block1Y(elem, yPos, dur, delay, ease, autoAlpha) {
//   if (!elem) return;
//   gsap.from(elem, {
//     y: yPos,
//     autoAlpha: autoAlpha,
//     duration: dur, //0.55
//     delay: delay,
//     ease: ease, //"elastic.inOut"
//   });
// }
// function Block1X(elem, xPos, dur, delay, ease, autoAlpha) {
//   if (!elem) return;
//   gsap.from(elem, {
//     x: xPos,
//     autoAlpha: autoAlpha,
//     duration: dur, //0.55
//     delay: delay,
//     ease: ease, //"elastic.inOut"
//   });
// }
//
// function rotateCircles() {
//   gsap.to("#big-c", {
//     rotation: 360,
//     transformOrigin: "center",
//     repeat: -1,
//     duration: 10, // Adjust duration as needed
//   });
//   gsap.to("#small-c", {
//     rotation: -360,
//     transformOrigin: "center",
//     repeat: -1,
//     duration: 6, // Adjust duration as needed
//   });
// }
//
// --- replaced by decorHover() (dots ripple, hatch stripes shift; plain images still grow) ---
// function changeScale(elem) {
//   if (!elem) return;
//   if (elemLoaded === true) {
//     elem.addEventListener("mouseenter", (e) => {
//       gsap.to(elem, { transformOrigin: "bottom center", scale: 1.2, duration: 0.25, ease: "power4.inOut" });
//     });
//     elem.addEventListener("mouseleave", (e) => {
//       gsap.to(elem, { scale: 1, duration: 0.25, ease: "power4.inOut" });
//     });
//   }
// }
