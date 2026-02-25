// src/pages/api/update-score.ts
// Admin endpoint: upsert a score row in "puntuaciones"
import type { APIRoute } from "astro";
import { supabase } from "../../db/supabase.js";

export const POST: APIRoute = async ({ request }) => {
    try {
        const { team_id, id_fase, estatus, puntos } = await request.json();

        if (!team_id || !id_fase) {
            return new Response(
                JSON.stringify({ error: "team_id e id_fase son requeridos." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const { error } = await supabase
            .from("scores")
            .upsert(
                { team_id, phase_id: id_fase, status: estatus, points: puntos },
                { onConflict: "team_id,phase_id" }
            );

        if (error) {
            console.error("update-score error:", error);
            return new Response(
                JSON.stringify({ error: "Error al guardar. " + error.message }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(
            JSON.stringify({ error: "Error inesperado." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};
