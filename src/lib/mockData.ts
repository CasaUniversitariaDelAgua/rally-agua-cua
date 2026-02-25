// src/lib/mockData.ts
// ─── Tipos y helpers compartidos ─────────────────────────────────────────────
// Los datos reales vienen de Supabase (ver ScoreboardLive.tsx / index.astro)

export interface Phase {
  phaseId: number;
  status: 'pending' | 'doing' | 'done';
  points: number;
}

export interface Team {
  id: number;
  name: string;
  color: string;
  members: string[];
  phases: Phase[];
}

export const PHASES = [
  { id: 1, name: 'Fase 1: Inicio' },
  { id: 2, name: 'Fase 2: Exploración' },
  { id: 3, name: 'Fase 3: Desafío' },
  { id: 4, name: 'Fase 4: Cumbre' },
  { id: 5, name: 'Fase 5: Final' },
];

export function totalScore(team: Team): number {
  return team.phases.reduce((sum, p) => sum + p.points, 0);
}

export function getSortedTeams(teams: Team[]): Team[] {
  return [...teams].sort((a, b) => totalScore(b) - totalScore(a));
}

export function getCurrentPhase(team: Team) {
  const doing = team.phases.find(p => p.status === 'doing');
  if (doing) return { ...doing, label: 'En curso', phaseClass: 'doing' };
  const lastDone = [...team.phases].reverse().find(p => p.status === 'done');
  if (lastDone) return { ...lastDone, label: 'Completado', phaseClass: 'done' };
  return { phaseId: 1, status: 'pending' as const, points: 0, label: 'Sin iniciar', phaseClass: 'waiting' };
}
