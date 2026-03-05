import { e as createComponent, n as renderHead, g as addAttribute, o as renderSlot, r as renderTemplate, h as createAstro } from './astro/server_CwtUBU6d.mjs';
import 'piccolore';
import 'clsx';
/* empty css                         */

const $$Astro = createAstro();
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title, activePage } = Astro2.props;
  return renderTemplate`<html lang="es" data-astro-cid-37fxchfa> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title} — Rally de Competencia</title><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>${renderHead()}</head> <body data-astro-cid-37fxchfa> <!-- ── NAVBAR ── --> <header class="nav" data-astro-cid-37fxchfa> <div class="nav-logo" data-astro-cid-37fxchfa>RALLY<span data-astro-cid-37fxchfa>X</span></div> <nav class="nav-tabs" aria-label="Navegación principal" data-astro-cid-37fxchfa> <a href="/"${addAttribute(["nav-tab", { active: activePage === "scoreboard" }], "class:list")}${addAttribute(activePage === "scoreboard" ? "page" : void 0, "aria-current")} data-astro-cid-37fxchfa> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:6px" data-astro-cid-37fxchfa> <rect x="18" y="3" width="4" height="18" data-astro-cid-37fxchfa></rect><rect x="10" y="8" width="4" height="13" data-astro-cid-37fxchfa></rect><rect x="2" y="13" width="4" height="8" data-astro-cid-37fxchfa></rect> </svg>
Marcador
</a> <a href="/admin"${addAttribute(["nav-tab", { active: activePage === "admin" }], "class:list")}${addAttribute(activePage === "admin" ? "page" : void 0, "aria-current")} data-astro-cid-37fxchfa> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:6px" data-astro-cid-37fxchfa> <circle cx="12" cy="12" r="3" data-astro-cid-37fxchfa></circle><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" data-astro-cid-37fxchfa></path> </svg>
Panel Admin
</a> </nav> <div class="live-badge" data-astro-cid-37fxchfa> <span class="live-dot" aria-hidden="true" data-astro-cid-37fxchfa></span>
En Vivo
</div> </header> <!-- ── PAGE CONTENT ── --> <main data-astro-cid-37fxchfa> ${renderSlot($$result, $$slots["default"])} </main>  </body></html>`;
}, "C:/Users/Manue/Documents/Rally-Cua/src/layouts/BaseLayout.astro", void 0);

const PHASES = [
  { id: 1, name: "Fase 1: Inicio" },
  { id: 2, name: "Fase 2: Exploración" },
  { id: 3, name: "Fase 3: Desafío" },
  { id: 4, name: "Fase 4: Cumbre" },
  { id: 5, name: "Fase 5: Final" }
];
function totalScore(team) {
  return team.phases.reduce((sum, p) => sum + p.points, 0);
}
function getSortedTeams(teams) {
  return [...teams].sort((a, b) => totalScore(b) - totalScore(a));
}
function getCurrentPhase(team) {
  const doing = team.phases.find((p) => p.status === "doing");
  if (doing) return { ...doing, label: "En curso", phaseClass: "doing" };
  const lastDone = [...team.phases].reverse().find((p) => p.status === "done");
  if (lastDone) return { ...lastDone, label: "Completado", phaseClass: "done" };
  return { phaseId: 1, status: "pending", points: 0, label: "Sin iniciar", phaseClass: "waiting" };
}

export { $$BaseLayout as $, PHASES as P, getCurrentPhase as a, getSortedTeams as g, totalScore as t };
