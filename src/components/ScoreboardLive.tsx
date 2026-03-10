// src/components/ScoreboardLive.tsx
// React island — carga datos iniciales como prop, luego escucha Realtime
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { getSortedTeams, totalScore, getCurrentPhase } from "../lib/mockData";
import type { Team } from "../lib/mockData";

interface Props {
  initialTeams: Team[];
}

// ── Helpers ────────────────────────────────────────────────────────────────

async function fetchTeams(): Promise<Team[]> {
  const { data, error } = await supabase
    .from("teams")
    .select("id, name, color, members, scores(phase_id, status, points)")
    .order("id");

  if (error || !data) {
    console.error("fetchTeams error:", error);
    return [];
  }

  return data.map((row: any) => ({
    id: row.id,
    name: row.name,
    color: row.color,
    members: Array.isArray(row.members) ? row.members : [],
    phases: [1, 2, 3, 4, 5].map((phaseId) => {
      const s = (row.scores ?? []).find((sc: any) => sc.phase_id === phaseId);
      return {
        phaseId,
        status: s?.status ?? "pending",
        points: s?.points ?? 0,
      };
    }),
  }));
}

const PHASES = [
  { id: 1, name: "Fase 1" },
  { id: 2, name: "Fase 2" },
  { id: 3, name: "Fase 3" },
  { id: 4, name: "Fase 4" },
  { id: 5, name: "Fase 5" },
];

// ── Sub-components ──────────────────────────────────────────────────────────

function PhasePills({ teams }: { teams: Team[] }) {
  const statuses = PHASES.map((phase) => {
    const allDone = teams.every(
      (t) => t.phases[phase.id - 1]?.status === "done",
    );
    const anyDoing = teams.some(
      (t) => t.phases[phase.id - 1]?.status === "doing",
    );
    if (allDone) return "completed";
    if (anyDoing) return "active";
    return "pending";
  });

  return (
    <div className="phase-pills">
      {PHASES.map((phase, i) => {
        const s = statuses[i];
        const icon = s === "completed" ? "✓" : s === "active" ? "⚡" : "○";
        return (
          <span key={phase.id} className={`phase-pill ${s}`}>
            {icon} {phase.name}
          </span>
        );
      })}
    </div>
  );
}

function TeamCard({ team, rank }: { team: Team; rank: number }) {
  const score = totalScore(team);
  const cp = getCurrentPhase(team);
  const isFirst = rank === 1;

  return (
    <article
      className={`team-card${isFirst ? " team-card--first" : ""}`}
      style={{ "--team-color": team.color } as React.CSSProperties}
      aria-label={`${team.name}, posición ${rank}, ${score} puntos`}
    >
      <div className="rank">{isFirst ? "🏆" : rank}</div>

      <div className="info">
        <div className="team-name">{team.name}</div>
        <div className="members">{team.members.join(" · ")}</div>
      </div>

      <div className="phase-block">
        <span className={`phase-tag ${cp.phaseClass}`}>{cp.label}</span>
        <div className="phase-dots">
          {team.phases.map((p) => (
            <span
              key={p.phaseId}
              className={`dot${p.status === "done" ? " done" : p.status === "doing" ? " active" : ""}`}
            />
          ))}
        </div>
      </div>

      <div className="score-block">
        <span className="score-value">{score}</span>
        <span className="score-label">pts</span>
      </div>
    </article>
  );
}

function ProgressBars({ teams }: { teams: Team[] }) {
  const sorted = getSortedTeams(teams);
  const maxPts = Math.max(...teams.map((t) => totalScore(t)), 1);

  return (
    <section className="progress-section">
      <h2 className="section-label">
        Progreso general
        <span className="section-line" />
      </h2>
      <div className="bars">
        {sorted.map((team) => {
          const score = totalScore(team);
          const pct = Math.round((score / maxPts) * 100);
          return (
            <div key={team.id} className="bar-row">
              <span className="bar-name" style={{ color: team.color }}>
                {team.name}
              </span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={
                    {
                      width: `${pct}%`,
                      "--fill-a": `${team.color}88`,
                      "--fill-b": team.color,
                    } as React.CSSProperties
                  }
                />
              </div>
              <span className="bar-pct">{pct}%</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── Main island ─────────────────────────────────────────────────────────────

export default function ScoreboardLive({ initialTeams }: Props) {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [updating, setUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(
    new Date().toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  );

  const refresh = useCallback(async () => {
    setUpdating(true);
    const fresh = await fetchTeams();
    if (fresh.length > 0) {
      setTeams(fresh);
      setLastUpdate(
        new Date().toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    }
    setUpdating(false);
  }, []);

  useEffect(() => {
    // Subscribe to any change in scores table
    const channel = supabase
      .channel("scores-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "scores" },
        () => {
          refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refresh]);

  const sorted = getSortedTeams(teams);

  return (
    <div className="scoreboard">
      {/* Hero */}
      <header className="hero">
        <p className="hero-eyebrow">
          Temporada 2025 · {teams.length} Equipos · 5 Fases
        </p>
        <h1 className="hero-title">
          RALLY <em>DE</em>
          <br />
          COMPETENCIA
        </h1>
        <div className="hero-divider" />
        <p className="hero-update">
          {updating ? (
            <span className="updating-badge">⟳ Actualizando…</span>
          ) : (
            <>
              Última actualización: <time>{lastUpdate}</time>
              <span className="live-pill">● EN VIVO</span>
            </>
          )}
        </p>
      </header>

      {/* Phase pills */}
      {teams.length > 0 && <PhasePills teams={teams} />}

      {/* Ranking */}
      {teams.length === 0 ? (
        <p className="empty-msg">No hay equipos registrados aún.</p>
      ) : (
        <section aria-label="Clasificación de equipos">
          <ol className="ranking-list">
            {sorted.map((team, i) => (
              <li key={team.id} style={{ animationDelay: `${i * 0.05}s` }}>
                <TeamCard team={team} rank={i + 1} />
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Progress bars */}
      {teams.length > 0 && <ProgressBars teams={teams} />}

      <style>{`
        /* ── Scoreboard ── */
        .scoreboard { max-width: 900px; margin: 0 auto; padding: 2.5rem 1.5rem 4rem; }

        /* ── Hero ── */
        .hero { text-align: center; margin-bottom: 2.5rem; }
        .hero-eyebrow {
          font-family: var(--font-archer);
          font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.35em; text-transform: uppercase;
          color: var(--dirt); margin-bottom: 0.6rem;
        }
        .hero-title {
          font-family: var(--font-archer);
          font-size: clamp(3.5rem, 10vw, 7.5rem);
          letter-spacing: 0.06em; line-height: 0.9;
          color: var(--sand);
          text-shadow: 3px 3px 0 var(--dirt-dark), 6px 6px 0 rgba(0,0,0,0.25);
        }
        .hero-title em { font-style: normal; color: var(--rust); }
        .hero-divider {
          width: 100px; height: 3px;
          background: linear-gradient(90deg, transparent, var(--dirt), transparent);
          margin: 1rem auto 0.6rem;
        }
        .hero-update {
          font-family: var(--font-archer);
          font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(196,163,90,0.45);
          display: flex; align-items: center; justify-content: center; gap: 0.6rem;
        }
        .live-pill {
          color: #5cdb5c; font-size: 0.65rem;
          animation: blink 1.6s ease-in-out infinite;
        }
        .updating-badge { color: var(--dirt); animation: blink 0.8s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

        /* ── Phase pills ── */
        .phase-pills {
          display: flex; justify-content: center;
          gap: 0.5rem; flex-wrap: wrap; margin-bottom: 2.5rem;
        }
        .phase-pill {
          font-family: var(--font-archer);
          font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 0.3rem 0.9rem; border-radius: 2px; border: 1px solid;
        }
        .phase-pill.completed { background: rgba(74,92,58,0.3); border-color: var(--moss-light); color: var(--moss-light); }
        .phase-pill.active    { background: rgba(196,163,90,0.18); border-color: var(--dirt); color: var(--dirt); animation: glow 2s ease-in-out infinite; }
        .phase-pill.pending   { background: transparent; border-color: rgba(196,163,90,0.2); color: rgba(196,163,90,0.3); }
        @keyframes glow { 0%,100%{box-shadow:0 0 0 rgba(196,163,90,0)} 50%{box-shadow:0 0 14px rgba(196,163,90,0.4)} }

        /* ── Ranking ── */
        .ranking-list { list-style:none; display:flex; flex-direction:column; gap:0.65rem; }
        .ranking-list li { animation: slide-in 0.45s ease both; }

        /* ── Team card ── */
        .team-card {
          display: grid; grid-template-columns: 56px 1fr auto auto;
          align-items: center; gap: 1rem; padding: 1.1rem 1.5rem;
          background: rgba(61,43,31,0.55); border: 1px solid rgba(196,163,90,0.12);
          border-left: 4px solid var(--team-color);
          backdrop-filter: blur(4px); position: relative; overflow: hidden;
        }
        .team-card::before {
          content:''; position:absolute; inset:0;
          background: linear-gradient(90deg,rgba(255,255,255,0.025) 0%,transparent 60%);
          pointer-events:none;
        }
        .team-card--first { background: rgba(139,105,20,0.18); border-color: rgba(196,163,90,0.35); border-left-color: var(--team-color); }
        @keyframes slide-in { from{opacity:0;transform:translateX(-18px)} to{opacity:1;transform:translateX(0)} }

        .rank { font-family:'Bebas Neue',sans-serif; font-size:2.2rem; color:rgba(196,163,90,0.28); text-align:center; line-height:1; }
        .team-card--first .rank { font-size:2rem; color:var(--dirt); }

        .team-name { font-family:'Barlow Condensed',sans-serif; font-size:1.3rem; font-weight:700; letter-spacing:0.05em; text-transform:uppercase; color:var(--ash); }
        .members { font-size:0.75rem; color:var(--fog); opacity:0.55; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

        .phase-block { text-align:right; }
        .phase-tag { font-family:'Barlow Condensed',sans-serif; font-size:0.65rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; padding:0.18rem 0.55rem; border-radius:2px; display:inline-block; margin-bottom:0.35rem; border:1px solid; }
        .phase-tag.doing   { background:rgba(196,163,90,0.15); color:var(--dirt); border-color:var(--dirt); }
        .phase-tag.done    { background:rgba(74,92,58,0.25);   color:var(--moss-light); border-color:var(--moss-light); }
        .phase-tag.waiting { background:rgba(255,255,255,0.04); color:var(--fog); opacity:0.45; border-color:rgba(255,255,255,0.1); }

        .phase-dots { display:flex; gap:4px; justify-content:flex-end; }
        .dot { width:10px; height:10px; border-radius:1px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.1); }
        .dot.done   { background:var(--moss); border-color:var(--moss-light); }
        .dot.active { background:var(--dirt); border-color:var(--dirt); box-shadow:0 0 6px var(--dirt); animation:dot-pulse 1.5s infinite; }
        @keyframes dot-pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }

        .score-block { text-align:right; }
        .score-value { display:block; font-family:'Bebas Neue',sans-serif; font-size:2.6rem; color:var(--sand); line-height:1; }
        .team-card--first .score-value { font-size:3.2rem; color:var(--dirt); }
        .score-label { font-family:'Barlow Condensed',sans-serif; font-size:0.62rem; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:rgba(196,163,90,0.35); }

        /* ── Progress bars ── */
        .progress-section { margin-top:3rem; }
        .section-label { font-family:'Barlow Condensed',sans-serif; font-size:0.75rem; font-weight:700; letter-spacing:0.3em; text-transform:uppercase; color:var(--dirt); display:flex; align-items:center; gap:0.8rem; margin-bottom:1rem; }
        .section-line { flex:1; height:1px; background:linear-gradient(90deg,rgba(196,163,90,0.3),transparent); }
        .bars { display:flex; flex-direction:column; gap:0.55rem; }
        .bar-row { display:grid; grid-template-columns:150px 1fr 60px; align-items:center; gap:1rem; }
        .bar-name { font-family:'Barlow Condensed',sans-serif; font-size:0.88rem; font-weight:700; letter-spacing:0.04em; text-transform:uppercase; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .bar-track { height:14px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.07); border-radius:2px; overflow:hidden; }
        .bar-fill { height:100%; background:linear-gradient(90deg,var(--fill-a),var(--fill-b)); border-radius:1px; position:relative; transition:width 0.9s cubic-bezier(0.4,0,0.2,1); }
        .bar-pct { font-family:'Barlow Condensed',sans-serif; font-size:0.8rem; font-weight:600; color:var(--fog); opacity:0.55; text-align:right; }

        /* ── Empty ── */
        .empty-msg { text-align:center; color:var(--fog); opacity:0.5; padding:3rem 0; font-family:'Barlow Condensed',sans-serif; letter-spacing:0.1em; }

        /* ── Responsive ── */
        @media(max-width:600px){
          .team-card { grid-template-columns:40px 1fr auto; }
          .phase-block { display:none; }
          .score-value { font-size:2rem; }
          .bar-row { grid-template-columns:100px 1fr 48px; }
        }
      `}</style>
    </div>
  );
}
