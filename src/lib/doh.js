const withCacheBust = (url) => {
  const cacheBust = `cb=${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${url}${url.includes("?") ? "&" : "?"}${cacheBust}`;
};

const fetchDnsJson = async (url) => {
  const res = await fetch(withCacheBust(url), {
    cache: "no-store",
    headers: { accept: "application/dns-json" }
  });

  if (!res.ok) return null;
  return res.json();
};

export const resolveARecord = async (hostname) => {
  const endpoints = [
    `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=A`,
    `https://dns.google/resolve?name=${encodeURIComponent(hostname)}&type=A`
  ];

  const results = await Promise.allSettled(endpoints.map((u) => fetchDnsJson(u)));
  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    const data = r.value;
    const answers = Array.isArray(data?.Answer) ? data.Answer : [];
    if (data?.Status === 0 && answers.length > 0) return { ok: true, data };
  }

  return { ok: false, data: null };
};

export const resolveTxtRecord = async (hostname) => {
  const endpoints = [
    `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=TXT`,
    `https://dns.google/resolve?name=${encodeURIComponent(hostname)}&type=TXT`
  ];

  const results = await Promise.allSettled(endpoints.map((u) => fetchDnsJson(u)));
  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    const data = r.value;
    const answers = Array.isArray(data?.Answer) ? data.Answer : [];
    const texts = answers
      .map((a) => (typeof a?.data === "string" ? a.data : ""))
      .map((t) => t.replaceAll('"', "").trim())
      .filter(Boolean);

    if (data?.Status === 0 && texts.length > 0) return { ok: true, texts };
  }

  return { ok: false, texts: [] };
};

