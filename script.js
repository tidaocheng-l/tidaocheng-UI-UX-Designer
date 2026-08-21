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
const portfolioFilterButtons = Array.from(document.querySelectorAll("[data-portfolio-filter]"));
const portfolioCards = Array.from(document.querySelectorAll("[data-portfolio-card]"));
const workCards = Array.from(document.querySelectorAll("[data-work-card]"));
const portfolioIntro = document.querySelector(".portfolio-page-intro");
const portfolioIntroTitle = portfolioIntro?.querySelector("#portfolio-page-title");
const portfolioIntroTagline = portfolioIntro?.querySelector(".portfolio-page-intro-tagline");
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
const splashSeenStorageKey = "portfolio-splash-seen";
const portfolioTagLabels = {
  uiux: "UI设计",
  web: "网页设计",
  brand: "品牌VI",
  poster: "海报设计",
  video: "视频剪辑",
  photo: "摄影"
};
const portfolioWorkCatalog = {
  "personal-site": {
    href: "work-detail.html",
    image: "./assets/work-detail-hero.png",
    imageWidth: 2400,
    imageHeight: 970,
    title: "我的个人网站，是怎么从一个想法变成现实的",
    description: "让作品被看见，也让设计思考留下来",
    tagKeys: ["web", "uiux"],
    categories: "web uiux"
  }
};

const hasSeenSplash = () => {
  try {
    return window.sessionStorage.getItem(splashSeenStorageKey) === "true";
  } catch {
    return false;
  }
};

const markSplashSeen = () => {
  try {
    window.sessionStorage.setItem(splashSeenStorageKey, "true");
  } catch {
    // Session storage can be unavailable in restricted browsing contexts.
  }
};

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

const skipSplash = () => {
  body?.classList.remove("is-loading");
  body?.classList.add("is-splash-done");

  if (!splash) return;
  splash.classList.add("is-hidden");
  splash.setAttribute("hidden", "");
  splash.style.setProperty("--splash-progress", "100%");
  if (splashProgress) splashProgress.style.setProperty("--splash-progress", "100%");
  if (splashPercent) splashPercent.textContent = "100%";
};

const startSplash = () => {
  if (!splash) {
    skipSplash();
    return;
  }

  if (hasSeenSplash()) {
    skipSplash();
    return;
  }

  markSplashSeen();
  prepareSplashTitle();

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

let isNavScrolled = false;
let hasUserScrolledNav = false;

const enableNavScrolledState = () => {
  hasUserScrolledNav = true;
  setScrolledState();
};

const resetNavScrolledState = () => {
  hasUserScrolledNav = false;
  isNavScrolled = false;
  nav?.classList.remove("is-scrolled");
  setScrolledState();
};

const setScrolledState = () => {
  if (!nav) return;
  const shouldBeScrolled = hasUserScrolledNav && (isNavScrolled ? window.scrollY > 72 : window.scrollY > 90);
  if (shouldBeScrolled !== isNavScrolled) {
    isNavScrolled = shouldBeScrolled;
    nav.classList.toggle("is-scrolled", isNavScrolled);
  }

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

const applyPortfolioFilter = filter => {
  if (!portfolioFilterButtons.length || !portfolioCards.length) return;

  portfolioFilterButtons.forEach(button => {
    const isActive = button.dataset.portfolioFilter === filter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  portfolioCards.forEach(card => {
    const categories = (card.dataset.portfolioCategory || "").split(/\s+/).filter(Boolean);
    const isVisible = filter === "all" || categories.includes(filter);
    card.hidden = !isVisible;
    card.classList.toggle("is-hidden", !isVisible);
  });
};

const getPortfolioFilterFromHash = () => {
  const hash = window.location.hash.replace("#", "");
  const filterKey = hash.replace("filter-", "");
  const matchedButton = portfolioFilterButtons.find(button => button.id === hash || button.dataset.portfolioFilter === filterKey);

  return matchedButton?.dataset.portfolioFilter || "all";
};

const splitWorkKeys = value => {
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value || "")
    .split(/\s+/)
    .filter(Boolean);
};

const getWorkTagLabels = work => {
  const customTags = Array.isArray(work.tags) ? work.tags.filter(Boolean) : [];
  const tagKeys = splitWorkKeys(work.tagKeys || work.categories);
  const inferredTags = tagKeys.map(key => portfolioTagLabels[key] || key).filter(Boolean);

  return Array.from(new Set([...customTags, ...inferredTags]));
};

const getOrCreatePortfolioTags = content => {
  if (!content) return null;

  const tags = content.querySelector(".portfolio-tags");
  if (tags) return tags;

  const createdTags = document.createElement("span");
  createdTags.className = "portfolio-tags";
  content.appendChild(createdTags);
  return createdTags;
};

const syncPortfolioWorkCards = () => {
  workCards.forEach(card => {
    const work = portfolioWorkCatalog[card.dataset.workCard];
    if (!work) return;

    const link = card.querySelector(".portfolio-link");
    const media = card.querySelector(".portfolio-media");
    const content = card.querySelector(".portfolio-content");
    const title = card.querySelector(".portfolio-title-row strong");
    const description = card.querySelector(".portfolio-desc");
    const tagLabels = getWorkTagLabels(work);
    const tags = tagLabels.length ? getOrCreatePortfolioTags(content) : card.querySelector(".portfolio-tags");
    const image = media?.querySelector("img");

    if (link) {
      link.href = work.href;
      link.setAttribute("aria-label", `查看 ${work.title}`);
    }

    if (image) {
      if (image.parentElement?.tagName === "PICTURE") {
        media.replaceChildren(image);
      }
      image.src = work.image;
      image.alt = `${work.title}作品预览图`;
      image.width = work.imageWidth;
      image.height = work.imageHeight;
    }

    if (title) title.textContent = work.title;
    if (description) description.textContent = work.description;

    if (tags && tagLabels.length) {
      tags.setAttribute("aria-label", "作品标签");
      tags.replaceChildren(
        ...tagLabels.map(tag => {
          const tagElement = document.createElement("span");
          tagElement.textContent = tag;
          return tagElement;
        })
      );
    } else if (tags) {
      tags.remove();
    }

    if (card.matches("[data-portfolio-card]") && work.categories) {
      card.dataset.portfolioCategory = work.categories;
    }
  });
};

const splitPortfolioIntroText = (element, className, delayBase, delayStep) => {
  if (!element) return;

  const text = element.textContent || "";
  const fragment = document.createDocumentFragment();
  element.setAttribute("aria-label", text);

  Array.from(text).forEach((char, index) => {
    const span = document.createElement("span");
    const yOffset = ((index % 4) - 1.5) * 7;
    const rotation = ((index % 5) - 2) * 1.5;

    span.className = `${className}${char.trim() ? "" : " portfolio-intro-space"}`;
    span.textContent = char;
    span.style.setProperty("--intro-char-index", index);
    span.style.setProperty("--intro-char-y", `${yOffset.toFixed(1)}px`);
    span.style.setProperty("--intro-char-rotate", `${rotation.toFixed(1)}deg`);
    span.style.setProperty("--intro-char-delay", `${delayBase + index * delayStep}ms`);
    fragment.appendChild(span);
  });

  element.replaceChildren(fragment);
};

const setupPortfolioIntroMotion = () => {
  if (!portfolioIntro || prefersReducedMotion.matches) return;

  splitPortfolioIntroText(portfolioIntroTitle, "portfolio-intro-char", 120, 42);
  splitPortfolioIntroText(portfolioIntroTagline, "portfolio-intro-tagline-char", 760, 34);
  requestAnimationFrame(() => portfolioIntro.classList.add("is-intro-ready"));

  if (!window.matchMedia("(pointer: fine)").matches) return;

  const resetIntroParallax = () => {
    portfolioIntro.style.setProperty("--intro-shift-x", "0px");
    portfolioIntro.style.setProperty("--intro-shift-y", "0px");
    portfolioIntro.style.setProperty("--intro-tilt-x", "0deg");
    portfolioIntro.style.setProperty("--intro-tilt-y", "0deg");
  };

  portfolioIntro.addEventListener(
    "pointermove",
    event => {
      const rect = portfolioIntro.getBoundingClientRect();
      const normalizedX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const normalizedY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      const x = Math.max(-1, Math.min(1, normalizedX));
      const y = Math.max(-1, Math.min(1, normalizedY));

      portfolioIntro.style.setProperty("--intro-shift-x", `${(x * 7).toFixed(2)}px`);
      portfolioIntro.style.setProperty("--intro-shift-y", `${(y * 4).toFixed(2)}px`);
      portfolioIntro.style.setProperty("--intro-tilt-x", `${(y * -1.1).toFixed(2)}deg`);
      portfolioIntro.style.setProperty("--intro-tilt-y", `${(x * 1.6).toFixed(2)}deg`);
    },
    { passive: true }
  );
  portfolioIntro.addEventListener("pointerleave", resetIntroParallax);
};

const storedTheme = readStoredTheme();
if (storedTheme === "dark") {
  root.dataset.theme = "dark";
}

updateNavHeight();
resetNavScrolledState();
updateScrollEffects();
syncThemeToggle();
syncPortfolioWorkCards();
startSplash();
setupPortfolioIntroMotion();

window.addEventListener("scroll", setScrolledState, { passive: true });
window.addEventListener("scroll", queueScrollEffects, { passive: true });
window.addEventListener("wheel", enableNavScrolledState, { passive: true });
window.addEventListener("touchmove", enableNavScrolledState, { passive: true });
window.addEventListener("pointerdown", event => {
  if (event.clientX >= document.documentElement.clientWidth - 20) {
    enableNavScrolledState();
  }
});
window.addEventListener("keydown", event => {
  const scrollKeys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " ", "Spacebar"];
  if (scrollKeys.includes(event.key)) {
    enableNavScrolledState();
  }
});
window.addEventListener("pageshow", resetNavScrolledState);
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

if (portfolioFilterButtons.length) {
  applyPortfolioFilter(getPortfolioFilterFromHash());

  portfolioFilterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.portfolioFilter || "all";
      applyPortfolioFilter(filter);
      const nextUrl = filter === "all" ? window.location.pathname : `#filter-${filter}`;
      window.history.replaceState(null, "", nextUrl);
    });
  });

  window.addEventListener("hashchange", () => applyPortfolioFilter(getPortfolioFilterFromHash()));
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
