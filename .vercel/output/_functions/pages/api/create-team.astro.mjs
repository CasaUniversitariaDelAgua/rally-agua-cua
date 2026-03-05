import { s as supabase } from '../../chunks/supabase_Dumwzhpz.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const { nombre, color, miembros } = await request.json();
    if (!nombre) {
      return new Response(
        JSON.stringify({ error: "El nombre del equipo es requerido." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const { data, error } = await supabase.from("teams").insert([{ name: nombre, color: color ?? "#C4A35A", members: miembros ?? [] }]).select("id").single();
    if (error) {
      console.error("create-team error:", error);
      return new Response(
        JSON.stringify({ error: "Error al crear equipo. " + error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(JSON.stringify({ success: true, id: data.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Error inesperado." }),
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
