/*
 * Gallery page behaviour
 * ----------------------
 * - Category list  -> opens one category in the viewer panel (deep-linkable: gallery.html#ui-ux)
 * - Viewer tabs    -> switch category without going back to the list
 * - Thumbnails     -> open a lightbox (prev/next, keyboard, swipe, caption)
 * - Videos         -> only one plays at a time; all pause when the category changes or the viewer closes
 *
 * Kept separate from app.js on purpose: app.js depends on GSAP loaded from a CDN, and
 * if that fails the gallery should still work.
 */
(function () {
  "use strict";

  var CATEGORIES = ["photoshop", "illustrator", "ui-ux", "multi-media"];

  var menu = document.getElementById("gallery");
  var display = document.getElementById("gallery-display");
  var lb = document.getElementById("lightbox");
  if (!menu || !display || !lb) return;

  var tabList = document.getElementById("gallery-tabs");
  var tabs = Array.prototype.slice.call(display.querySelectorAll(".gallery-tab"));
  var panels = Array.prototype.slice.call(display.querySelectorAll(".box"));
  var videos = Array.prototype.slice.call(display.querySelectorAll("video"));
  var closeBtn = document.getElementById("close-btn");
  var menuLinks = Array.prototype.slice.call(menu.querySelectorAll(".gallery-links a"));
  var lastMenuLink = null;

  /* ---------- helpers ---------- */

  function categoryFromHash() {
    var h = "";
    try {
      h = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    } catch (e) {}
    return CATEGORIES.indexOf(h) > -1 ? h : null;
  }

  function pauseVideos(except) {
    videos.forEach(function (v) {
      if (v !== except && !v.paused) v.pause();
    });
  }

  videos.forEach(function (v) {
    v.addEventListener("play", function () {
      pauseVideos(v);
    });
  });

  /* ---------- viewer panel ---------- */

  // Scroll only the tab strip. (Element.scrollIntoView would also scroll #container1, which has
  // overflow:hidden but still scrolls programmatically because of the decorative graphics.)
  function centerTab(tab) {
    var list = tabList.getBoundingClientRect();
    var box = tab.getBoundingClientRect();
    tabList.scrollLeft += box.left - list.left - (list.width - box.width) / 2;
  }

  // Single source of truth: the URL hash decides what is on screen. Safe to call repeatedly.
  function render() {
    var cat = categoryFromHash();
    var wasOpen = display.classList.contains("is-open");
    pauseVideos();
    closeLightbox();

    if (!cat) {
      display.classList.remove("is-open");
      menu.hidden = false;
      // viewer just closed (close button, Esc or browser Back): put keyboard focus back on the list
      var target = lastMenuLink || menuLinks[0];
      if (wasOpen && target) target.focus({ preventScroll: true });
      return null;
    }

    menu.hidden = true;
    display.classList.add("is-open");
    tabs.forEach(function (tab) {
      var selected = tab.getAttribute("data-category") === cat;
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.tabIndex = selected ? 0 : -1;
      if (selected) centerTab(tab);
    });
    panels.forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-category") !== cat;
    });
    return cat;
  }

  function activeTab() {
    return tabs.filter(function (t) {
      return t.getAttribute("aria-selected") === "true";
    })[0];
  }

  function openCategory(cat, trigger) {
    lastMenuLink = trigger || null;
    // pushState so the browser Back button returns to the category list
    window.history.pushState({ gallery: true }, "", "#" + cat);
    render();
    var tab = activeTab();
    if (tab) tab.focus({ preventScroll: true });
  }

  function switchCategory(cat) {
    // replaceState: switching tabs shouldn't fill the history with entries
    window.history.replaceState(window.history.state, "", "#" + cat);
    render();
  }

  function closeGallery() {
    if (window.history.state && window.history.state.gallery) {
      window.history.back(); // popstate -> render()
    } else {
      // arrived via a deep link: there is no earlier entry to go back to
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      render();
    }
  }

  menuLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      openCategory(link.getAttribute("data-category"), link);
    });
  });

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      switchCategory(tab.getAttribute("data-category"));
    });
    // arrow-key navigation between tabs (ARIA tabs pattern)
    tab.addEventListener("keydown", function (e) {
      var i = tabs.indexOf(tab);
      var next;
      if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
      else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = tabs.length - 1;
      else return;
      e.preventDefault();
      switchCategory(tabs[next].getAttribute("data-category"));
      tabs[next].focus({ preventScroll: true });
    });
  });

  closeBtn.addEventListener("click", closeGallery);
  window.addEventListener("popstate", render);
  window.addEventListener("hashchange", render);

  /* ---------- lightbox ---------- */

  var lbImg = lb.querySelector(".lb-img");
  var lbTitle = lb.querySelector(".lb-title");
  var lbCount = lb.querySelector(".lb-count");
  var lbClose = lb.querySelector(".lb-close");
  var lbPrev = lb.querySelector(".lb-prev");
  var lbNext = lb.querySelector(".lb-next");
  var items = [];
  var index = 0;
  var lbTrigger = null;
  var loadToken = 0;

  function preload(url) {
    var img = new Image();
    img.src = url;
  }

  function show(i) {
    index = (i + items.length) % items.length;
    var thumb = items[index];
    var thumbImg = thumb.querySelector("img");
    var full = thumb.getAttribute("data-full");
    var token = ++loadToken;

    lbTitle.textContent = thumb.getAttribute("data-title") || "";
    lbCount.textContent = index + 1 + " / " + items.length;
    lbImg.alt = thumbImg ? thumbImg.alt : "";

    // keep the previous image (dimmed) until the next one is ready, so nothing jumps
    lbImg.classList.add("is-loading");
    var loader = new Image();
    loader.onload = function () {
      if (token !== loadToken) return; // a newer image was requested meanwhile
      lbImg.src = full;
      lbImg.classList.remove("is-loading");
    };
    loader.onerror = function () {
      if (token !== loadToken) return;
      lbImg.classList.remove("is-loading");
    };
    loader.src = full;

    if (items.length > 1) {
      preload(items[(index + 1) % items.length].getAttribute("data-full"));
      preload(items[(index - 1 + items.length) % items.length].getAttribute("data-full"));
    }
  }

  function openLightbox(thumb) {
    var panel = thumb.closest(".box");
    items = Array.prototype.slice.call(panel.querySelectorAll(".thumb"));
    lbTrigger = thumb;
    lb.hidden = false;
    document.documentElement.classList.add("lb-open");
    show(items.indexOf(thumb));
    lbClose.focus({ preventScroll: true });
  }

  function closeLightbox() {
    if (lb.hidden) return;
    lb.hidden = true;
    loadToken++; // cancel any in-flight load
    lbImg.removeAttribute("src");
    document.documentElement.classList.remove("lb-open");
    if (lbTrigger && document.body.contains(lbTrigger) && display.classList.contains("is-open")) {
      lbTrigger.focus({ preventScroll: true });
    }
  }

  display.addEventListener("click", function (e) {
    var thumb = e.target.closest(".thumb");
    if (thumb) openLightbox(thumb);
  });

  lbClose.addEventListener("click", closeLightbox);
  lbPrev.addEventListener("click", function () {
    show(index - 1);
  });
  lbNext.addEventListener("click", function () {
    show(index + 1);
  });
  // click on the dark backdrop closes
  lb.addEventListener("click", function (e) {
    if (e.target === lb) closeLightbox();
  });

  // swipe left/right on touch screens
  var touchX = 0;
  var touchY = 0;
  lb.addEventListener(
    "touchstart",
    function (e) {
      touchX = e.changedTouches[0].clientX;
      touchY = e.changedTouches[0].clientY;
    },
    { passive: true }
  );
  lb.addEventListener(
    "touchend",
    function (e) {
      var dx = e.changedTouches[0].clientX - touchX;
      var dy = e.changedTouches[0].clientY - touchY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        show(dx < 0 ? index + 1 : index - 1);
      }
    },
    { passive: true }
  );

  document.addEventListener("keydown", function (e) {
    if (!lb.hidden) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        show(index - 1);
      } else if (e.key === "ArrowRight") {
        show(index + 1);
      } else if (e.key === "Tab") {
        // keep keyboard focus inside the dialog
        var focusable = [lbClose, lbPrev, lbNext];
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (focusable.indexOf(document.activeElement) === -1) {
          e.preventDefault();
          first.focus();
        }
      }
      return;
    }
    if (e.key === "Escape" && display.classList.contains("is-open")) {
      closeGallery();
    }
  });

  /* ---------- go ---------- */

  render(); // honour a deep link such as gallery.html#ui-ux

  // Safety net: the page starts hidden (body { visibility: hidden }) and GSAP, loaded from a CDN,
  // reveals it. If that script is blocked or offline the page would stay blank, so reveal it anyway.
  window.addEventListener("load", function () {
    window.setTimeout(function () {
      if (window.getComputedStyle(document.body).visibility === "hidden") {
        document.body.style.visibility = "visible";
      }
    }, 2500);
  });
})();
