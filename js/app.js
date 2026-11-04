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
const gridBlock = document.querySelector("#block-grid");
const colorBlocks = [block2, block5, block6, block7, block8, block9, block10, block11];
const blockColors = ["#ebf3cd", "#64a7e9", "#66a293", "#66d6d4", "#707070", "ffffff", "#170046", "080909"];
const goldDots2 = document.querySelector("#gold-dots2");
const whiteDots3 = document.querySelector("#white-dots3");
const torqoise2 = document.querySelector("#torqoise-hatch2");
const goldHatch3 = document.querySelector("#gold-hatch3");
const smallCircles3 = document.querySelector("#small-circles3");
const scrollIndicator = document.getElementById("scroll-indicator");
// const scrollHeading = document.getElementById("scrollHeading");
const scrollHeading = document.querySelector("#scrollHeading");
const scrollDownChevron = document.getElementById("down-chevron");

// gsap.set("#large-circles", {opacity: 0});
// gsap.set("#large-circles2", {opacity: 0});
console.log(scrollDownChevron);
hamburger.addEventListener("click", () => {
  landing.classList.toggle("open");
  links.forEach((link) => {
    link.classList.toggle("fade");
  });
  bar1.classList.toggle("bar1");
  bar2.classList.toggle("bar2");
  bar3.classList.toggle("bar3");
});

if (landing.classList.contains("open")) {
  links.forEach((link) => {
    link.addEventListener("click", () => {
      landing.classList.toggle("open");
      bar1.classList.toggle("bar1");
      bar2.classList.toggle("bar2");
      bar3.classList.toggle("bar3");
    })
  });
}

gsap.registerPlugin(GSDevTools, SplitText, TextPlugin, ScrollTrigger);
let elemLoaded = false;
function init() {
  gsap.from(body, {autoAlpha: 0, duration: 0.25});
  // Block1X or Y(elem, x or yPos, dur, delay, ease, autoAlpha)
  bGFadeIn("#container1");

  splitText2("#about-description", 0.5, 1.5, 0.2);
  splitText(uiUx, 0.5);
  splitText(fEd, 1.5);
  splitText(fSd, 3);
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
  //scroll indicator animation
  gsap.fromTo("#scroll-indicator-div", 
    {autoAlpha: 0, y: 20}, 
    {autoAlpha: 1, y: 0, duration: 1, ease: "power4.out", delay: 4}
  );
  splitText(scrollHeading, 0.5);
    gsap.to(scrollDownChevron, {
    y: -8,          // move up 8px (relative to its current position)
    duration: 0.6,
    ease: "sine.inOut", // smooth, subtle
    yoyo: true,     // go back and forth
    repeat: -1      // infinite
  });
  //testing scrolltrigger
  const indicatorTween = gsap.to(scrollIndicator, {
    autoAlpha: 0,
    y: 20,
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
//
  // changeBlock(gridBlock, 1.5, 1.25);

  function changeScale(elem) {
    if (elemLoaded === true) {
      elem.addEventListener("mouseenter", (e) => {
        gsap.to(elem, { transformOrigin: "bottom center", scale: 1.2, duration: 0.25, ease: "power4.inOut" });
      });
      elem.addEventListener("mouseleave", (e) => {
        gsap.to(elem, { scale: 1, duration: 0.25, ease: "power4.inOut" });
      });
    }
  }
//only for the grid block
  function changeBlock(elem, scale1, scale2) {//1.2, 1
    if (elemLoaded === true) {
      elem.addEventListener("mouseenter", (e) => {
        gsap.to(elem, { z: 100,transformOrigin: "center center", scale: scale1, duration: 0.25, ease: "power4.inOut" });
        // gsap.to(block2, {background: "$green", duration: 1});
      });
      elem.addEventListener("mouseleave", (e) => {
        gsap.to(elem, { scale: scale2, duration: 0.25, ease: "power4.inOut" });
        // gsap.to(block2, {background: "white", duration: 1});
      });
    }
  }

function bGFadeIn(a) {
  gsap.from(a, {
    // autoAlpha: 0,
    backgroundColor: "#170046",
    duration: 5,
    ease: "power4.inOut",
    delay: 1,
  });
}
function splitText(a, b) {
  let split = new SplitText(a, { type: "chars" });
  gsap.from(split.chars, {
    duration: 0.175,
    opacity: 0,
    stagger: 0.1,
    ease: "back",
    delay: b,
    repeat: -1,
    yoyo: true
  });
}
function splitText2(a, b, c, d) {
  let split = new SplitText(a, { type: "words" });
  gsap.from(split.words, {
    duration: c,//0.175
    opacity: 0,
    stagger: d,
    ease: "back",
    delay: b,
    repeat: -1,
    // yoyo: true
  });
}
function Block1Y(elem, yPos, dur, delay, ease, autoAlpha) {
  gsap.from(elem, {
    y: yPos,
    autoAlpha: autoAlpha,
    duration: dur, //0.55
    delay: delay,
    // ease: "bounce.out"
    ease: ease, //"elastic.inOut"
    // repeat: -1,
    // yoyo: true
  });
}
function Block1X(elem, xPos, dur, delay, ease, autoAlpha) {
  gsap.from(elem, {
    x: xPos,
    autoAlpha: autoAlpha,
    duration: dur, //0.55
    delay: delay,
    // ease: "bounce.out"
    ease: ease, //"elastic.inOut"
    // repeat: -1, 
    // yoyo: true
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
// window.addEventListener("load", init);
document.addEventListener("DOMContentLoaded", init);
//note to self, re-order sequence of animations, and introduce timelines and ,aster timelines


//lenis for smooth scrolling
// const lenis = new Lenis()

// function raf(time) {
// lenis.raf(time)
// requestAnimationFrame(raf)
// }

// requestAnimationFrame(raf)

// Gallery page behaviour (category viewer, lightbox) now lives in js/gallery.js
