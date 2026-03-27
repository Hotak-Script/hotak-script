document.querySelectorAll('.page-grid .media-card').forEach((card, index) => {
  card.style.transitionDelay = `${Math.min(index * 70, 420)}ms`;
});

const pageName = window.location.pathname.split("/").pop() || "";
const langMap = {
  "blog-html.html": "HTML",
  "blog-css.html": "CSS",
  "blog-javascript.html": "JAVASCRIPT",
  "blog-python.html": "PYTHON",
  "blog-sql.html": "SQL"
};

const currentLang = langMap[pageName];

if (currentLang) {
  document.querySelectorAll(".article-card pre").forEach((pre) => {
    if (pre.previousElementSibling?.classList.contains("code-toolbar")) {
      return;
    }

    const toolbar = document.createElement("div");
    toolbar.className = "code-toolbar";
    toolbar.innerHTML = `<span class="code-lang">${currentLang}</span><button class="code-copy" type="button">Copy</button>`;

    const copyBtn = toolbar.querySelector(".code-copy");
    copyBtn?.addEventListener("click", async () => {
      const code = pre.querySelector("code")?.textContent ?? "";
      try {
        await navigator.clipboard.writeText(code);
        copyBtn.textContent = "Copied";
        setTimeout(() => {
          copyBtn.textContent = "Copy";
        }, 900);
      } catch {
        copyBtn.textContent = "Error";
        setTimeout(() => {
          copyBtn.textContent = "Copy";
        }, 900);
      }
    });

    pre.parentNode?.insertBefore(toolbar, pre);
  });
}
