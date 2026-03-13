// src/pages/api/approve-team.ts
// Admin endpoint: promote a registration into an active team + initialize scores
import type { APIRoute } from "astro";
import { supabase } from "../../db/supabase.js";
import { sendApprovalEmail } from "../../lib/mailer";

const MAX_TEAMS = 10;

export const POST: APIRoute = async ({ request }) => {
    try {
        const { registration_id } = await request.json();

        if (!registration_id) {
            return new Response(
                JSON.stringify({ error: "registration_id es requerido." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // ── Check team cap ────────────────────────────────────────────
        const { count, error: countError } = await supabase
            .from("teams")
            .select("*", { count: "exact", head: true });

        if (countError) {
            return new Response(
                JSON.stringify({ error: "No se pudo verificar el cupo." }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        if ((count ?? 0) >= MAX_TEAMS) {
            return new Response(
                JSON.stringify({ error: `Cupo lleno: ya hay ${MAX_TEAMS} equipos activos.` }),
                { status: 409, headers: { "Content-Type": "application/json" } }
            );
        }

        // ── Fetch registration ────────────────────────────────────────
        const { data: reg, error: regError } = await supabase
            .from("registrations")
            .select("*")
            .eq("id", registration_id)
            .single();

        if (regError || !reg) {
            return new Response(
                JSON.stringify({ error: "Inscripción no encontrada." }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        // ── Parse members (stored as text, newline or comma separated) ─
        const members: string[] = reg.members
            .split(/[\n,]/)
            .map((m: string) => m.trim())
            .filter(Boolean);

        // ── Insert into teams ─────────────────────────────────────────
        const { data: team, error: teamError } = await supabase
            .from("teams")
            .insert([{
                name: reg.team_name.trim(),
                color: "#C4A35A",   // default; admin can change later
                members,
            }])
            .select("id, name, color, members")
            .single();

        if (teamError || !team) {
            console.error("approve-team insert error:", teamError);
            return new Response(
                JSON.stringify({ error: "Error al crear el equipo: " + teamError?.message }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        // ── Initialize 5 score rows ───────────────────────────────────
        const scoreRows = [1, 2, 3, 4, 5].map((phase_id) => ({
            team_id: team.id,
            phase_id,
            status: "pending",
            points: 0,
        }));

        const { error: scoresError } = await supabase
            .from("scores")
            .insert(scoreRows);

        if (scoresError) {
            console.error("approve-team scores error:", scoresError);
        }

        // ── Mark registration as approved ────────────────────────────
        const { error: updateError, data: updateData } = await supabase
            .from("registrations")
            .update({ approved_at: new Date().toISOString() })
            .eq("id", registration_id)
            .select();

        if (updateError || !updateData || updateData.length === 0) {
             console.error("error marking approved", updateError);
             return new Response(
                JSON.stringify({ error: "No se pudo actualizar la inscripción (posible bloqueo de RLS)." }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        // ── Send Welcome Email ───────────────────────────────────────
        try {
            await sendApprovalEmail(reg.email, team.name);
        } catch (emailErr) {
            console.error("No se pudo enviar el correo a " + reg.email, emailErr);
            // We dont fail the approval if the email fails.
        }

        return new Response(
            JSON.stringify({ success: true, team }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );

    } catch (err) {
        console.error("approve-team unexpected error:", err);
        return new Response(
            JSON.stringify({ error: "Error inesperado." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};
