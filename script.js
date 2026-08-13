const root = document.documentElement;
const body = document.body;
const splash = document.querySelector("[data-splash]");
const splashTitleLines = document.querySelectorAll("[data-splash-line]");
const splashSubtitle = document.querySelector("[data-splash-subtitle]");
const splashPhrase = document.querySelector("[data-splash-phrase]");
const splashPercent = document.querySelector("[data-splash-percent]");
const splashProgress = document.querySelector("[data-splash-progress]");
const nav = document.querySelector(".site-nav");
const shell = document.querySelector(".site-shell");
const themeToggle = document.querySelector("[data-theme-toggle]");
const contactTriggers = document.querySelectorAll("[data-contact-trigger]");
const contactPopup = document.querySelector("[data-contact-popup]");
const contactHost = contactPopup?.closest(".hero");
const revealItems = document.querySelectorAll(".reveal");
const capabilityCards = document.querySelectorAll(".capability-card");
const tiltItems = document.querySelectorAll("[data-tilt]");
const workflowToys = document.querySelectorAll("[data-workflow-toy]");
const navLinks = Array.from(document.querySelectorAll(".nav-link[href^='#']"));
const navAnchors = Array.from(document.querySelectorAll(".nav-menu a[href^='#']"));
const navDropdowns = document.querySelectorAll(".nav-dropdown");
const scrollMotionItems = Array.from(document.querySelectorAll(".motion-card:not(.capability-card), .tool-visual"));
const workflowParticles = document.querySelector(".workflow-particles");
const darkNavSections = Array.from(document.querySelectorAll(".workflow"));
const toast = document.querySelector("[data-site-toast]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const canAnimateScroll = !prefersReducedMotion.matches;

if (canAnimateScroll) {
  root.classList.add("motion-ready");
}

const splashPhrases = [
  "正在把像素摆正",
  "给灵感通个电",
  "让好奇心先到场",
  "把生活感装进页面"
];

const createSplashChar = (char, index, options = {}) => {
  const charWrap = document.createElement("span");
  const {
    className = "splash-char",
    delayBase = 0,
    delayStep = 34,
    rotateStep = 2.6,
    xStep = 2.4,
    yBase = 14,
    yStep = 7,
    yCycle = 4
  } = options;

  const charClass = `splash-text-char ${className}`;
  charWrap.className = char.trim() ? charClass : `${charClass} splash-char-space`;
  charWrap.style.setProperty("--char-index", index);
  charWrap.style.setProperty("--char-delay", `${delayBase + index * delayStep}ms`);
  charWrap.style.setProperty("--char-x", `${((index % 6) - 2.5) * xStep}px`);
  charWrap.style.setProperty("--char-rotate", `${((index % 5) - 2) * rotateStep}deg`);
  charWrap.style.setProperty("--char-y", `${yBase + (index % yCycle) * yStep}px`);
  charWrap.textContent = char;
  return charWrap;
};

const splitSplashText = (element, options = {}) => {
  if (!element) return;
  let charIndex = 0;
  const rebuilt = document.createDocumentFragment();

  Array.from(element.childNodes).forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE && node.matches(".splash-mobile-break")) {
      rebuilt.appendChild(node.cloneNode(true));
      return;
    }

    const text = node.textContent || "";
    Array.from(text).forEach(char => {
      rebuilt.appendChild(createSplashChar(char, charIndex, options));
      charIndex += 1;
    });
  });

  element.textContent = "";
  element.appendChild(rebuilt);
};

const setSplashPhraseText = text => {
  if (!splashPhrase) return;
  splashPhrase.textContent = text;
  splitSplashText(splashPhrase, {
    className: "splash-phrase-char",
    delayBase: 0,
    delayStep: 16,
    rotateStep: 1.8,
    xStep: 1.6,
    yBase: 8,
    yStep: 3,
    yCycle: 3
  });
};

const prepareSplashTitle = () => {
  splashTitleLines.forEach((line, lineIndex) => {
    splitSplashText(line, {
      className: "splash-char",
      delayBase: lineIndex * 110,
      delayStep: 20,
      rotateStep: 2.6,
      xStep: 2,
      yBase: 14,
      yStep: 7,
      yCycle: 4
    });
  });
  splitSplashText(splashSubtitle, {
    className: "splash-subtitle-char",
    delayBase: 340,
    delayStep: 6,
    rotateStep: 0.6,
    xStep: 1.4,
    yBase: 8,
    yStep: 2,
    yCycle: 3
  });
  setSplashPhraseText(splashPhrases[0]);
};

const finishSplash = () => {
  if (!splash || splash.classList.contains("is-exiting")) return;
  splash.classList.add("is-exiting");
  body?.classList.remove("is-loading");
  body?.classList.add("is-splash-done");
  window.setTimeout(() => {
    splash.classList.add("is-hidden");
    splash.setAttribute("hidden", "");
  }, prefersReducedMotion.matches ? 20 : 700);
};

prepareSplashTitle();

const startSplash = () => {
  if (!splash) {
    body?.classList.remove("is-loading");
    return;
  }

  if (prefersReducedMotion.matches) {
    if (splashPercent) splashPercent.textContent = "100%";
    if (splashProgress) splashProgress.style.setProperty("--splash-progress", "100%");
    finishSplash();
    return;
  }

  const startedAt = performance.now();
  const duration = 2800;
  let activePhraseIndex = -1;
  let isComplete = false;
  const setSplashPhrase = phraseIndex => {
    if (!splashPhrase || phraseIndex === activePhraseIndex) return;
    activePhraseIndex = phraseIndex;
    splashPhrase.classList.remove("is-changing");
    void splashPhrase.offsetWidth;
    setSplashPhraseText(splashPhrases[phraseIndex]);
    splashPhrase.classList.add("is-changing");
  };
  const complete = () => {
    if (isComplete) return;
    isComplete = true;
    splash.style.setProperty("--splash-progress", "100%");
    if (splashProgress) splashProgress.style.setProperty("--splash-progress", "100%");
    if (splashPercent) splashPercent.textContent = "100%";
    setSplashPhrase(splashPhrases.length - 1);
    window.setTimeout(finishSplash, 180);
  };

  const tick = now => {
    const elapsed = now - startedAt;
    const rawProgress = Math.min(1, elapsed / duration);
    const easedProgress = 1 - Math.pow(1 - rawProgress, 3);
    const percent = Math.min(100, Math.round(easedProgress * 100));

    splash.style.setProperty("--splash-progress", `${percent}%`);
    if (splashProgress) splashProgress.style.setProperty("--splash-progress", `${percent}%`);
    if (splashPercent) splashPercent.textContent = `${percent}%`;
    setSplashPhrase(Math.min(splashPhrases.length - 1, Math.floor(rawProgress * splashPhrases.length)));

    if (rawProgress < 1) {
      requestAnimationFrame(tick);
    } else {
      complete();
    }
  };

  window.setTimeout(complete, duration + 420);
  requestAnimationFrame(tick);
};

const updateNavHeight = () => {
  if (!nav) return;
  root.style.setProperty("--nav-height", `${Math.ceil(nav.getBoundingClientRect().height)}px`);
};

const setScrolledState = () => {
  if (!nav) return;
  nav.classList.toggle("is-scrolled", window.scrollY > 10);

  const navProbeY = nav.getBoundingClientRect().bottom - 1;
  const isOverDarkSection = darkNavSections.some(section => {
    const rect = section.getBoundingClientRect();
    return rect.top <= navProbeY && rect.bottom >= navProbeY;
  });
  nav.classList.toggle("is-over-dark", isOverDarkSection);
};

let scrollRaf = 0;

const updateScrollEffects = () => {
  scrollRaf = 0;

  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  root.style.setProperty("--scroll-progress", `${Math.min(1, window.scrollY / maxScroll).toFixed(4)}`);

  if (!canAnimateScroll) return;

  const viewportCenter = window.innerHeight / 2;
  scrollMotionItems.forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.top + rect.height / 2;
    const distance = (itemCenter - viewportCenter) / window.innerHeight;
    const clamped = Math.max(-1, Math.min(1, distance));
    const shift = clamped * -18;
    const scale = 1 - Math.abs(clamped) * 0.018;

    item.style.setProperty("--scroll-shift", `${shift.toFixed(2)}px`);
    item.style.setProperty("--scroll-scale", scale.toFixed(4));
    item.style.setProperty("--scroll-delay", `${index * 24}ms`);
  });

  if (workflowParticles) {
    const rect = workflowParticles.getBoundingClientRect();
    const progress = Math.max(-1, Math.min(1, (rect.top - window.innerHeight * 0.3) / window.innerHeight));
    workflowParticles.style.setProperty("--particle-drift", `${(progress * -22).toFixed(2)}px`);
    workflowParticles.style.setProperty("--particle-tilt", `${(progress * 0.7).toFixed(3)}deg`);
  }
};

const queueScrollEffects = () => {
  if (!scrollRaf) {
    scrollRaf = requestAnimationFrame(updateScrollEffects);
  }
};

const setActiveNav = id => {
  navLinks.forEach(link => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
  });
};

const showToast = message => {
  if (!toast || !message) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
};

const openContactPopup = () => {
  if (!contactHost || !contactPopup) return;
  window.clearTimeout(openContactPopup.closeTimer);
  contactHost.classList.add("is-contact-open");
  contactPopup.setAttribute("aria-hidden", "false");
};

const closeContactPopup = () => {
  if (!contactHost || !contactPopup) return;
  window.clearTimeout(openContactPopup.closeTimer);
  openContactPopup.closeTimer = window.setTimeout(() => {
    contactHost.classList.remove("is-contact-open");
    contactPopup.setAttribute("aria-hidden", "true");
  }, 140);
};

const readStoredTheme = () => {
  try {
    return window.localStorage.getItem("site-theme");
  } catch {
    return "";
  }
};

const storeTheme = theme => {
  try {
    if (theme) {
      window.localStorage.setItem("site-theme", theme);
    } else {
      window.localStorage.removeItem("site-theme");
    }
  } catch {
    // Local storage can be blocked in private browsing contexts.
  }
};

const syncThemeToggle = () => {
  themeToggle?.setAttribute("aria-pressed", root.dataset.theme === "dark" ? "true" : "false");
};

const resetPointerGradient = () => {
  root.style.removeProperty("--gradient-x");
  root.style.removeProperty("--gradient-y");
};

const storedTheme = readStoredTheme();
if (storedTheme === "dark") {
  root.dataset.theme = "dark";
}

updateNavHeight();
setScrolledState();
updateScrollEffects();
syncThemeToggle();
startSplash();

window.addEventListener("scroll", setScrolledState, { passive: true });
window.addEventListener("scroll", queueScrollEffects, { passive: true });
window.addEventListener("resize", updateNavHeight);
window.addEventListener("resize", queueScrollEffects);

if ("ResizeObserver" in window && nav) {
  new ResizeObserver(updateNavHeight).observe(nav);
}

if (shell && window.matchMedia("(pointer: fine)").matches && !prefersReducedMotion.matches) {
  const pointer = {
    targetX: window.innerWidth / 2 + 420,
    targetY: 72,
    currentX: window.innerWidth / 2 + 420,
    currentY: 72,
    raf: 0
  };

  const renderGradient = () => {
    if (root.dataset.theme === "dark") {
      pointer.raf = 0;
      resetPointerGradient();
      return;
    }

    pointer.currentX += (pointer.targetX - pointer.currentX) * 0.12;
    pointer.currentY += (pointer.targetY - pointer.currentY) * 0.12;
    root.style.setProperty("--gradient-x", `${pointer.currentX.toFixed(1)}px`);
    root.style.setProperty("--gradient-y", `${pointer.currentY.toFixed(1)}px`);

    if (Math.abs(pointer.targetX - pointer.currentX) > 0.5 || Math.abs(pointer.targetY - pointer.currentY) > 0.5) {
      pointer.raf = requestAnimationFrame(renderGradient);
    } else {
      pointer.raf = 0;
    }
  };

  window.addEventListener(
    "pointermove",
    event => {
      if (root.dataset.theme === "dark") {
        resetPointerGradient();
        return;
      }

      pointer.targetX = event.clientX;
      pointer.targetY = event.clientY + window.scrollY;
      if (!pointer.raf) {
        pointer.raf = requestAnimationFrame(renderGradient);
      }
    },
    { passive: true }
  );
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "" : "dark";
    if (nextTheme) {
      root.dataset.theme = nextTheme;
    } else {
      delete root.dataset.theme;
    }
    if (nextTheme === "dark") {
      resetPointerGradient();
    }
    storeTheme(nextTheme);
    syncThemeToggle();
  });
}

document.querySelectorAll("[data-toast]").forEach(control => {
  control.addEventListener("click", () => showToast(control.dataset.toast));
});

contactTriggers.forEach(trigger => {
  trigger.addEventListener("pointerenter", openContactPopup);
  trigger.addEventListener("pointerleave", closeContactPopup);
  trigger.addEventListener("focusin", openContactPopup);
  trigger.addEventListener("focusout", closeContactPopup);
  trigger.addEventListener("click", event => {
    if (trigger.matches("[data-contact-trigger]")) {
      event.preventDefault();
    }
  });
});

navDropdowns.forEach(dropdown => {
  const trigger = dropdown.querySelector(".nav-dropdown-trigger");
  const setExpanded = expanded => trigger?.setAttribute("aria-expanded", expanded ? "true" : "false");

  dropdown.addEventListener("pointerenter", () => setExpanded(true));
  dropdown.addEventListener("pointerleave", () => setExpanded(false));
  dropdown.addEventListener("focusin", () => setExpanded(true));
  dropdown.addEventListener("focusout", event => {
    if (!dropdown.contains(event.relatedTarget)) {
      setExpanded(false);
    }
  });
});

navAnchors.forEach(link => {
  link.addEventListener("click", event => {
    const id = link.getAttribute("href")?.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;

    event.preventDefault();
    setActiveNav(id);
    navDropdowns.forEach(dropdown => dropdown.querySelector(".nav-dropdown-trigger")?.setAttribute("aria-expanded", "false"));
    const scrollTarget = id === "contact" ? document.getElementById("home") : target;
    scrollTarget.scrollIntoView({
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
      block: "start"
    });

    if (window.history.pushState) {
      window.history.pushState(null, "", `#${id}`);
    }
  });
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.forEach(item => revealObserver.observe(item));

  const sections = navLinks
    .map(link => document.getElementById(link.getAttribute("href").slice(1)))
    .filter(target => target?.matches("main > section, .site-footer"))
    .filter(Boolean);

  const navObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveNav(entry.target.id);
        }
      });
    },
    { threshold: 0.2, rootMargin: "-38% 0px -54% 0px" }
  );

  sections.forEach(section => navObserver.observe(section));
} else {
  revealItems.forEach(item => item.classList.add("is-visible"));
}

capabilityCards.forEach(card => {
  card.addEventListener("pointerenter", () => card.classList.add("is-hovered"));
  card.addEventListener("pointerleave", () => card.classList.remove("is-hovered"));
  card.addEventListener("focusin", () => card.classList.add("is-hovered"));
  card.addEventListener("focusout", () => card.classList.remove("is-hovered"));
});

workflowToys.forEach(toy => {
  const pop = () => {
    if (prefersReducedMotion.matches) return;
    toy.classList.remove("is-popping");
    void toy.offsetWidth;
    toy.classList.add("is-popping");
  };

  toy.addEventListener("click", pop);
  toy.addEventListener("animationend", event => {
    if (event.animationName === "workflow-pop") {
      toy.classList.remove("is-popping");
    }
  });
  toy.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      pop();
    }
  });
});

if (window.matchMedia("(pointer: fine)").matches && !prefersReducedMotion.matches) {
  tiltItems.forEach(item => {
    item.addEventListener(
      "pointermove",
      event => {
        const rect = item.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const tiltX = (0.5 - y) * 7;
        const tiltY = (x - 0.5) * 7;

        item.style.setProperty("--tilt-x", `${tiltY.toFixed(2)}deg`);
        item.style.setProperty("--tilt-y", `${tiltX.toFixed(2)}deg`);
        item.style.setProperty("--pointer-x", `${(x * 100).toFixed(1)}%`);
        item.style.setProperty("--pointer-y", `${(y * 100).toFixed(1)}%`);
      },
      { passive: true }
    );

    item.addEventListener("pointerleave", () => {
      item.style.setProperty("--tilt-x", "0deg");
      item.style.setProperty("--tilt-y", "0deg");
      item.style.setProperty("--pointer-x", "50%");
      item.style.setProperty("--pointer-y", "36%");
    });
  });
}
