// Mobile menu
const toggle = document.querySelector(".navToggle");
const nav = document.querySelector("#nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  // close on link click (mobile)
  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      if (nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  });
}

// Scroll reveal
const targets = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("is-visible");
    });
  },
  { threshold: 0.12 }
);
targets.forEach((el) => io.observe(el));

// ===== Start modal open/close =====
(() => {
  const startBtn = document.getElementById("startBtn");
  const modal = document.getElementById("startModal");
  if (!startBtn || !modal) return;

  const open = () => {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  startBtn.addEventListener("click", (e) => {
    e.preventDefault();
    open();
  });

  modal.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.dataset && t.dataset.close === "true") close();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) close();
  });
})();

// ===== Hero background morph on first scroll =====
(() => {
  const hero = document.querySelector(".heroCover");
  const bg = document.querySelector(".heroCover__bg");
  const overlay = document.querySelector(".heroCover__overlay");
  const frame = document.querySelector(".heroCover__frame");
  const copy = document.querySelector(".heroCover__copy");
  const scrollHint = document.querySelector(".heroCover__scroll");

  if (!hero || !bg || !overlay || !frame) return;

  // どれくらいスクロールしたら完成形にするか（px）
  const MORPH_DISTANCE = 420; // 好みで 320〜520

  const clamp01 = (v) => Math.max(0, Math.min(1, v));

  const lerp = (a, b, t) => a + (b - a) * t;

  function update() {
    const rectHero = hero.getBoundingClientRect();

    // heroの上端が画面上にある間だけ進める（0〜MORPH_DISTANCE）
    const scrolled = clamp01((-rectHero.top) / MORPH_DISTANCE);

    // 少しイージング（自然に）
    const t = scrolled * scrolled * (3 - 2 * scrolled); // smoothstep

    // 現在のbgの中心点（viewport座標）
    const bgRect = bg.getBoundingClientRect();
    const bgCx = bgRect.left + bgRect.width / 2;
    const bgCy = bgRect.top + bgRect.height / 2;

    // 目標フレームの中心点（viewport座標）
    const frRect = frame.getBoundingClientRect();
    const frCx = frRect.left + frRect.width / 2;
    const frCy = frRect.top + frRect.height / 2;

    // 目標スケール（フル→縮小）
    const scale = lerp(1.02, 0.78, t); // 0.72〜0.85くらいで調整OK

    // 移動量（中心合わせ）
    const dx = (frCx - bgCx);
    const dy = (frCy - bgCy);

    // tに応じて移動
    const tx = lerp(0, dx, t);
    const ty = lerp(0, dy, t);

    // 背景の変形
    bg.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;

    // 暗幕を薄く（スクロールで明るく）
    overlay.style.opacity = String(lerp(1, 0.15, t));

    // テキストは少しフェードアウトして上に逃がす（スクショみたいな空白を作る）
    if (copy) {
      copy.style.opacity = String(lerp(1, 0, t));
      copy.style.transform = `translateY(${lerp(0, -18, t)}px)`;
    }

    // Scrollヒントもフェードアウト
    if (scrollHint) {
      scrollHint.style.opacity = String(lerp(1, 0, t));
      scrollHint.style.transform = `translate(-50%, ${lerp(0, 8, t)}px)`;
    }
  }

  // 60fpsで回すのではなく、スクロール時だけ更新（軽い）
  let raf = 0;
  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      update();
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", update);

  // 初回
  update();
})();

