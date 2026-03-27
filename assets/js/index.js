const THEME_KEY = "hotak_theme";
const rootElement = document.documentElement;
const loaderStartTime = Date.now();

document.body.classList.add("is-loading");

const siteLoader = document.createElement("div");
siteLoader.className = "site-loader";
siteLoader.innerHTML = `
  <div>
    <div class="loader-core" aria-hidden="true"></div>
    <p class="loader-text">Hotak Script Loading</p>
  </div>
`;
document.body.appendChild(siteLoader);

const getSavedTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
};

const saveTheme = (theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Ignore storage errors (private mode / blocked storage)
  }
};

const getPreferredTheme = () => {
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }

  return "dark";
};

const setTheme = (theme) => {
  rootElement.setAttribute("data-theme", theme);
};

const initialTheme = getSavedTheme() || getPreferredTheme();
setTheme(initialTheme);

const topbar = document.querySelector(".topbar");
let themeToggleButton = document.getElementById("themeToggleBtn");

const updateThemeButton = () => {
  if (!themeToggleButton) return;

  const currentTheme = rootElement.getAttribute("data-theme") || "dark";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  themeToggleButton.textContent = nextTheme === "light" ? "Light Mode" : "Dark Mode";
  themeToggleButton.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
  themeToggleButton.setAttribute("aria-pressed", String(currentTheme === "light"));
};

if (topbar && !themeToggleButton) {
  themeToggleButton = document.createElement("button");
  themeToggleButton.type = "button";
  themeToggleButton.id = "themeToggleBtn";
  themeToggleButton.className = "theme-toggle";
  topbar.appendChild(themeToggleButton);
}

if (themeToggleButton) {
  updateThemeButton();
  themeToggleButton.addEventListener("click", () => {
    const activeTheme = rootElement.getAttribute("data-theme") || "dark";
    const nextTheme = activeTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    saveTheme(nextTheme);
    updateThemeButton();
  });
}

const hamburger = document.getElementById("hamburgerBtn");
const navMenu = document.getElementById("navMenu");

if (hamburger && navMenu) {
  if (themeToggleButton && themeToggleButton.parentElement === topbar) {
    topbar.insertBefore(themeToggleButton, hamburger);
  }

  hamburger.addEventListener("click", () => {
    const opened = navMenu.classList.toggle("show");
    hamburger.setAttribute("aria-expanded", String(opened));
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("show");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

const typeWriterElement = document.querySelector(".typeWriter");
const typeWords = [
  "HTML + CSS Foundations",
  "JavaScript Real Projects",
  "AI Tools for Developers",
  "DSA for Interviews"
];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function runTypeWriter() {
  if (!typeWriterElement) return;

  const currentWord = typeWords[wordIndex];

  if (!deleting) {
    charIndex += 1;
    typeWriterElement.textContent = currentWord.slice(0, charIndex);

    if (charIndex === currentWord.length) {
      deleting = true;
      setTimeout(runTypeWriter, 1300);
      return;
    }
  } else {
    charIndex -= 1;
    typeWriterElement.textContent = currentWord.slice(0, charIndex);

    if (charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % typeWords.length;
    }
  }

  const speed = deleting ? 45 : 80;
  setTimeout(runTypeWriter, speed);
}

runTypeWriter();

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealElements.length > 0) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealElements.forEach((el) => observer.observe(el));
}

const counters = document.querySelectorAll("[data-count]");
const animateCounter = (el) => {
  const target = Number(el.getAttribute("data-count") || 0);
  const duration = 1200;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.floor(progress * target);

    if (target >= 1000) {
      el.textContent = value.toLocaleString();
    } else {
      el.textContent = String(value);
    }

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

if ("IntersectionObserver" in window && counters.length > 0) {
  const counterObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.7 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

const yearNow = document.getElementById("yearNow");
if (yearNow) {
  yearNow.textContent = String(new Date().getFullYear());
}

const hideLoader = () => {
  const elapsed = Date.now() - loaderStartTime;
  const waitMs = Math.max(0, 500 - elapsed);

  setTimeout(() => {
    siteLoader.classList.add("is-hidden");
    document.body.classList.remove("is-loading");
    setTimeout(() => {
      siteLoader.remove();
    }, 360);
  }, waitMs);
};

if (document.readyState === "interactive" || document.readyState === "complete") {
  hideLoader();
} else {
  document.addEventListener("DOMContentLoaded", hideLoader, { once: true });
}
