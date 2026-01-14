import {
  ArrowRight,
  Building2,
  CalendarClock,
  Layers,
  LineChart,
  Menu,
  MessageCircle,
  Smartphone,
  Sparkles,
  Timer,
  Wand2,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Reveal from "./components/Reveal.jsx";
import { resolveARecord } from "./lib/doh.js";
import { getWhatsAppLink } from "./lib/whatsapp.js";

const classNames = (...v) => v.filter(Boolean).join(" ");

const Chip = ({ tone = "slate", children }) => {
  const tones = {
    slate: "bg-slate-800/70 text-slate-200 ring-slate-700",
    emerald: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
    blue: "bg-blue-500/10 text-blue-200 ring-blue-500/20",
    amber: "bg-amber-500/10 text-amber-200 ring-amber-500/20"
  };

  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1",
        tones[tone] || tones.slate
      )}
    >
      {children}
    </span>
  );
};

const Section = ({ id, eyebrow, title, children }) => (
  <section id={id} className="scroll-mt-24 py-20">
    <div className="mx-auto w-full max-w-6xl px-6">
      <Reveal>
        <div className="mb-10">
          {eyebrow ? (
            <div className="mb-3 text-sm font-medium tracking-wide text-slate-400">
              {eyebrow}
            </div>
          ) : null}
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-100 md:text-4xl">
            {title}
          </h2>
        </div>
      </Reveal>
      {children}
    </div>
  </section>
);

export default function App() {
  const [whatsAppHref, setWhatsAppHref] = useState("https://wa.me/?text=");
  const [agendaStatus, setAgendaStatus] = useState({ state: "checking", checkedAt: null });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const waMessage = useMemo(
    () =>
      "Olá! Quero solicitar um orçamento para um sistema sob medida. Podemos conversar?",
    []
  );

  useEffect(() => {
    let cancelled = false;
    getWhatsAppLink(waMessage).then((href) => {
      if (!cancelled) setWhatsAppHref(href);
    });
    return () => {
      cancelled = true;
    };
  }, [waMessage]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setAgendaStatus({ state: "checking", checkedAt: new Date() });
      const res = await resolveARecord("smagenda.com");
      if (cancelled) return;
      setAgendaStatus({ state: res.ok ? "online" : "offline", checkedAt: new Date() });
    };

    run();
    const t = setInterval(run, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  const agendaChip =
    agendaStatus.state === "online" ? (
      <Chip tone="emerald">Online (DNS)</Chip>
    ) : agendaStatus.state === "offline" ? (
      <Chip tone="amber">Indisponível (DNS)</Chip>
    ) : (
      <Chip tone="slate">Verificando…</Chip>
    );

  const navItems = [
    { href: "#inicio", label: "Início" },
    { href: "#sobre", label: "Sobre" },
    { href: "#produtos", label: "Produtos" },
    { href: "#servicos", label: "Serviços" },
    { href: "#metodo", label: "Método" },
    { href: "#contato", label: "Contato" }
  ];

  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.18),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(16,185,129,0.12),transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/35 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
          <a href="#inicio" className="flex items-center gap-3">
            <img
              src="/logo/logo-sm.svg"
              alt="Single Motion"
              className="h-9 w-auto"
              loading="eager"
              decoding="async"
            />
          </a>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex" aria-label="Navegação">
            {navItems.map((item) => (
              <a key={item.href} className="hover:text-slate-100" href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={whatsAppHref}
              target="_blank"
              rel="noreferrer"
              aria-label="Falar no WhatsApp"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-500 sm:px-4"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Falar no WhatsApp</span>
            </a>

            <button
              type="button"
              aria-label="Abrir menu"
              aria-expanded={mobileMenuOpen}
              className="inline-flex items-center justify-center rounded-full border border-slate-800 bg-slate-900/40 p-2 text-slate-100 backdrop-blur transition hover:border-slate-700 md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div
        className={classNames(
          "fixed inset-0 z-[60] md:hidden",
          mobileMenuOpen ? "" : "pointer-events-none"
        )}
      >
        <button
          type="button"
          aria-label="Fechar menu"
          className={classNames(
            "absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity",
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileMenuOpen(false)}
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={classNames(
            "absolute right-0 top-0 h-dvh w-80 max-w-[85vw] border-l border-slate-800 bg-slate-950/90 p-5 backdrop-blur transition-transform",
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-slate-200">Navegação</div>
            <button
              type="button"
              aria-label="Fechar"
              className="inline-flex items-center justify-center rounded-full border border-slate-800 bg-slate-900/40 p-2 text-slate-100 transition hover:border-slate-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 grid gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-xl border border-slate-800 bg-slate-900/30 px-4 py-3 text-sm text-slate-100 transition hover:border-slate-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="mt-6">
            <a
              href={whatsAppHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              <MessageCircle className="h-4 w-4" />
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </div>

      <main id="inicio">
        <section className="py-20 md:py-28">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 lg:grid-cols-2">
            <Reveal>
              <div>
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <Chip tone="blue">
                    <span className="inline-flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Software sob encomenda
                    </span>
                  </Chip>
                  {agendaChip}
                </div>

                <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
                  Ideias em movimento, {" "}
                  <span className="text-blue-500">soluções sob medida.</span>
                </h1>
                <p className="mt-5 max-w-xl text-pretty text-lg text-slate-400">
                  Transformamos sua necessidade de negócio em software de alto impacto.
                  Desenvolvimento ágil, preço justo e controle total nas suas mãos.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={whatsAppHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-500"
                  >
                    Solicitar Orçamento
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="#produtos"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/40 px-5 py-3 text-sm font-medium text-slate-100 backdrop-blur transition hover:border-slate-700"
                  >
                    Ver Produtos
                    <Layers className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal className="lg:justify-self-end">
              <div className="relative">
                <div className="absolute -inset-6 -z-10 rounded-[40px] bg-blue-500/10 blur-2xl" />

                <div className="rounded-[28px] border border-slate-800 bg-slate-900/40 p-3 shadow-2xl shadow-blue-500/10 backdrop-blur">
                  <div className="flex items-center gap-2 px-3 py-2">
                    <div className="h-3 w-3 rounded-full bg-red-500/70" />
                    <div className="h-3 w-3 rounded-full bg-amber-400/70" />
                    <div className="h-3 w-3 rounded-full bg-emerald-400/70" />
                    <div className="ml-auto h-2 w-24 rounded-full bg-slate-700/60" />
                  </div>

                  <div className="relative rounded-xl border border-slate-800 bg-slate-950 shadow-lg shadow-blue-500/10">
                    <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[20px] bg-[radial-gradient(circle_at_50%_20%,rgba(37,99,235,0.35),transparent_60%),radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.22),transparent_55%)] blur-2xl" />
                    <div className="overflow-hidden rounded-xl">
                      <picture>
                        <source srcSet="/logo/smagenda-config.webp" type="image/webp" />
                        <img
                          src="/logo/Sem%20t%C3%ADtul3.png"
                          alt="SM Agenda — tela de configurações"
                          className="block h-auto w-full"
                          loading="lazy"
                          decoding="async"
                        />
                      </picture>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <Section
          id="sobre"
          eyebrow="Filosofia"
          title="Orquestração, agilidade e foco no que importa"
        >
          <div className="grid gap-6 md:grid-cols-3">
            <Reveal>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/35 p-6 backdrop-blur">
                <div className="flex items-start gap-4">
                  <Timer className="mt-1 h-6 w-6 text-blue-500" />
                  <div>
                    <div className="text-lg font-semibold">Rapidez</div>
                    <div className="mt-1 text-sm text-slate-400">
                      Entregas iterativas com validação constante para reduzir risco.
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/35 p-6 backdrop-blur">
                <div className="flex items-start gap-4">
                  <Sparkles className="mt-1 h-6 w-6 text-emerald-400" />
                  <div>
                    <div className="text-lg font-semibold">Preço justo</div>
                    <div className="mt-1 text-sm text-slate-400">
                      Escopo claro, transparência e decisões guiadas por impacto.
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/35 p-6 backdrop-blur">
                <div className="flex items-start gap-4">
                  <Layers className="mt-1 h-6 w-6 text-blue-500" />
                  <div>
                    <div className="text-lg font-semibold">Orquestração</div>
                    <div className="mt-1 text-sm text-slate-400">
                      Stack moderna e automações para acelerar com qualidade.
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Section>

        <Section
          id="produtos"
          eyebrow="SaaS e Licenças"
          title="Nossos produtos, com foco em resultado"
        >
          <div className="grid gap-6 md:grid-cols-3">
            <Reveal>
              <div className="h-full rounded-2xl border border-slate-800 bg-slate-900/35 p-6 backdrop-blur">
                <div className="flex items-start justify-between gap-4">
                  <CalendarClock className="h-7 w-7 text-blue-500" />
                  <div className="flex items-center gap-2">
                    <Chip tone="emerald">Em Produção</Chip>
                  </div>
                </div>
                <h3 className="mt-4 text-xl font-semibold">SM Agenda</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Sistema de agendamento inteligente para prestadores de serviço.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">{agendaChip}</div>
                <a
                  href="https://smagenda.com"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300"
                >
                  Acessar
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </Reveal>

            <Reveal>
              <div className="h-full rounded-2xl border border-slate-800 bg-slate-900/35 p-6 backdrop-blur">
                <div className="flex items-start justify-between gap-4">
                  <Building2 className="h-7 w-7 text-emerald-400" />
                  <Chip tone="blue">Novo</Chip>
                </div>
                <h3 className="mt-4 text-xl font-semibold">SM Condomínio</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Gestão condominial completa com venda de licença única (sem mensalidade).
                </p>
                <div className="mt-4">
                  <Chip tone="slate">Lançamento</Chip>
                </div>
                <a
                  href="#contato"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-200 hover:text-slate-100"
                >
                  Ver Detalhes
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </Reveal>

            <Reveal>
              <div className="h-full rounded-2xl border border-slate-800 bg-slate-900/35 p-6 backdrop-blur">
                <div className="flex items-start justify-between gap-4">
                  <LineChart className="h-7 w-7 text-blue-500" />
                  <Chip tone="amber">Em Breve</Chip>
                </div>
                <h3 className="mt-4 text-xl font-semibold">SM Profit</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Inteligência financeira e cálculo real de lucro para microempreendedores.
                </p>
                <button
                  type="button"
                  disabled
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/40 px-4 py-2 text-sm font-medium text-slate-500"
                >
                  Aguarde
                  <Timer className="h-4 w-4" />
                </button>
              </div>
            </Reveal>
          </div>
        </Section>

        <Section
          id="servicos"
          eyebrow="Software House"
          title="Não achou o que precisa? Nós criamos."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/35 p-6 backdrop-blur">
                <div className="flex items-start gap-4">
                  <Wand2 className="mt-1 h-6 w-6 text-emerald-400" />
                  <div>
                    <div className="text-lg font-semibold">Automação de Processos</div>
                    <div className="mt-1 text-sm text-slate-400">Adeus planilhas manuais e retrabalho.</div>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/35 p-6 backdrop-blur">
                <div className="flex items-start gap-4">
                  <LineChart className="mt-1 h-6 w-6 text-blue-500" />
                  <div>
                    <div className="text-lg font-semibold">Dashboards Financeiros</div>
                    <div className="mt-1 text-sm text-slate-400">Visualize a saúde da sua empresa.</div>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/35 p-6 backdrop-blur">
                <div className="flex items-start gap-4">
                  <Layers className="mt-1 h-6 w-6 text-blue-500" />
                  <div>
                    <div className="text-lg font-semibold">ERPs Customizados</div>
                    <div className="mt-1 text-sm text-slate-400">Um sistema único para sua operação.</div>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/35 p-6 backdrop-blur">
                <div className="flex items-start gap-4">
                  <Smartphone className="mt-1 h-6 w-6 text-emerald-400" />
                  <div>
                    <div className="text-lg font-semibold">Apps & Web Systems</div>
                    <div className="mt-1 text-sm text-slate-400">Acesso de qualquer lugar, com performance.</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Section>

        <Section id="metodo" eyebrow="Diferencial" title="Nosso método para entregar rápido">
          <div className="grid gap-6 md:grid-cols-3">
            <Reveal>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/35 p-6 backdrop-blur">
                <div className="flex items-center gap-3">
                  <Chip tone="blue">01</Chip>
                  <div className="text-lg font-semibold">Planejamento</div>
                </div>
                <p className="mt-3 text-sm text-slate-400">
                  Entendemos sua dor e desenhamos a solução com métricas claras.
                </p>
              </div>
            </Reveal>
            <Reveal>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/35 p-6 backdrop-blur">
                <div className="flex items-center gap-3">
                  <Chip tone="blue">02</Chip>
                  <div className="text-lg font-semibold">Orquestração</div>
                </div>
                <p className="mt-3 text-sm text-slate-400">
                  Usamos tecnologias modernas e IA para acelerar a construção com qualidade.
                </p>
              </div>
            </Reveal>
            <Reveal>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/35 p-6 backdrop-blur">
                <div className="flex items-center gap-3">
                  <Chip tone="blue">03</Chip>
                  <div className="text-lg font-semibold">Entrega</div>
                </div>
                <p className="mt-3 text-sm text-slate-400">
                  Seu sistema no ar em semanas, com observabilidade e evolução contínua.
                </p>
              </div>
            </Reveal>
          </div>
        </Section>

        <Section id="contato" eyebrow="Contato" title="Vamos construir o seu próximo sistema?">
          <Reveal>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/35 p-8 backdrop-blur md:p-10">
              <div className="grid items-center gap-8 md:grid-cols-2">
                <div>
                  <p className="text-pretty text-slate-400">
                    Conte o que você precisa. Respondemos com um plano de entrega e próximos passos.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href={whatsAppHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-500"
                    >
                      Falar no WhatsApp
                      <MessageCircle className="h-4 w-4" />
                    </a>
                    <a
                      href="mailto:contato@singlemotion.org"
                      className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/40 px-5 py-3 text-sm font-medium text-slate-100 backdrop-blur transition hover:border-slate-700"
                    >
                      Enviar e-mail
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-6">
                  <div className="text-sm font-medium text-slate-200">E-mail</div>
                  <div className="mt-2 text-sm text-slate-400">contato@singlemotion.org</div>
                  <div className="mt-5 text-sm font-medium text-slate-200">SM Agenda</div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                    <span>smagenda.com</span>
                    {agendaChip}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </Section>
      </main>

      <footer className="border-t border-slate-800 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo/logo-sm.svg" alt="Single Motion" className="h-7 w-auto" decoding="async" />
            <div className="text-sm text-slate-400">Single Motion © 2026. Todos os direitos reservados.</div>
          </div>
          <div className="text-sm text-slate-500">Software sob encomenda • Produtos próprios</div>
        </div>
      </footer>
    </div>
  );
}
