import { createClient } from "@supabase/supabase-js";

// Extraemos las variables usando Vite/Astro syntax
const supabaseUrl = import.meta.env.SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const supabaseKey = import.meta.env.SUPABASE_KEY ?? process.env.SUPABASE_KEY ?? "";

// Creamos un cliente dummy si no hay URL (evita crashes durante el build de Astro)
export const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : { from: () => ({ select: () => ({ order: () => ({ data: [], error: null }) }) }) };
