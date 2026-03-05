import { s as supabase } from '../../chunks/supabase_Dumwzhpz.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      team_name,
      representative,
      phone,
      email,
      members,
      how_heard,
      institution,
      experience,
      special_needs,
      comments
    } = body;
    const required = { team_name, representative, phone, email, members, how_heard, institution, experience, special_needs };
    for (const [key, value] of Object.entries(required)) {
      if (!value || String(value).trim() === "") {
        return new Response(
          JSON.stringify({ error: `El campo "${key}" es obligatorio.` }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }
    const { count, error: countError } = await supabase.from("registrations").select("*", { count: "exact", head: true });
    if (countError) {
      console.error("Count error:", countError);
      return new Response(
        JSON.stringify({ error: "No se pudo verificar el límite de equipos." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const MAX_TEAMS = 10;
    if ((count ?? 0) >= MAX_TEAMS) {
      return new Response(
        JSON.stringify({
          error: `Lo sentimos, el cupo máximo de ${MAX_TEAMS} equipos ya fue alcanzado. ¡Gracias por tu interés!`
        }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }
    const { error } = await supabase.from("registrations").insert([
      {
        team_name: team_name.trim(),
        representative: representative.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        members: members.trim(),
        how_heard: how_heard.trim(),
        institution: institution.trim(),
        experience: experience.trim(),
        special_needs: special_needs.trim(),
        comments: comments?.trim() ?? null
      }
    ]);
    if (error) {
      console.error("Supabase error:", error);
      return new Response(
        JSON.stringify({ error: "Error al guardar el registro. Intenta de nuevo." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Error inesperado. Intenta de nuevo." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
