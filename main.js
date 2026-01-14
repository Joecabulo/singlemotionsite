const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const formatTime = (d) =>
  d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const setStatusUI = (state, label, checkedAt) => {
  const statusEls = document.querySelectorAll('[data-status="smagenda"]');
  const badgeEl = document.querySelector('[data-badge="smagenda"]');
  const timeEl = document.querySelector('[data-status-time="smagenda"]');
  const inlineEl = document.querySelector('[data-status-inline="smagenda"]');

  statusEls.forEach((el) => {
    el.dataset.state = state;
    const t = el.querySelector(".status__text");
    if (t) t.textContent = label;
  });

  if (badgeEl) {
    badgeEl.dataset.state = state;
    const t = badgeEl.querySelector(".badge__text");
    if (t) t.textContent = label;
  }

  const checkedLabel = checkedAt ? `Última checagem: ${formatTime(checkedAt)}` : "";
  if (timeEl) timeEl.textContent = checkedLabel;
  if (inlineEl) inlineEl.textContent = checkedAt ? `${label} • ${formatTime(checkedAt)}` : label;
};

const checkDnsJson = async (url) => {
  try {
    const cacheBust = `cb=${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const target = `${url}${url.includes("?") ? "&" : "?"}${cacheBust}`;
    const res = await fetch(target, {
      cache: "no-store",
      headers: { accept: "application/dns-json" },
    });
    if (!res.ok) return { ok: false };
    const data = await res.json();
    const answers = Array.isArray(data?.Answer) ? data.Answer : [];
    return { ok: data?.Status === 0 && answers.length > 0 };
  } catch {
    return { ok: false };
  }
};

const checkSmAgenda = async () => {
  setStatusUI("checking", "checando…");
  const checkedAt = new Date();

  const cf = await checkDnsJson("https://cloudflare-dns.com/dns-query?name=smagenda.com&type=A");
  if (cf.ok) return setStatusUI("up", "online", checkedAt);

  const gg = await checkDnsJson("https://dns.google/resolve?name=smagenda.com&type=A");
  if (gg.ok) return setStatusUI("up", "online", checkedAt);

  return setStatusUI("down", "indisponível", checkedAt);
};

const setupReveal = () => {
  const els = Array.from(document.querySelectorAll(".reveal"));
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      });
    },
    { threshold: 0.18 }
  );

  els.forEach((el) => io.observe(el));
};

const setupParallax = () => {
  const glow = document.querySelector(".bg__glow");
  const card = document.querySelector(".card3d");
  if (!glow && !card) return;

  const onMove = (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    if (glow) {
      const mx = (x - 0.5) * 22;
      const my = (y - 0.5) * 18;
      glow.style.setProperty("--mx", `${mx}px`);
      glow.style.setProperty("--my", `${my}px`);
    }

    if (card) {
      const rx = clamp((0.5 - y) * 10, -8, 8);
      const ry = clamp((x - 0.5) * 14, -10, 10);
      const sx = clamp(30 + x * 40, 20, 80);
      const sy = clamp(20 + y * 50, 10, 90);
      card.style.setProperty("--rx", `${rx}deg`);
      card.style.setProperty("--ry", `${ry}deg`);
      card.style.setProperty("--sx", `${sx}%`);
      card.style.setProperty("--sy", `${sy}%`);
    }
  };

  window.addEventListener("mousemove", onMove, { passive: true });
};


const setupRecheck = () => {
  const btn = document.querySelector('[data-action="recheck"]');
  if (!btn) return;
  btn.addEventListener("click", () => {
    checkSmAgenda();
  });
};

setupReveal();
setupParallax();
setupRecheck();
checkSmAgenda();
