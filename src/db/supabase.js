import { createClient } from "@supabase/supabase-js";

// Vite parsea import.meta.env en build time o dev time
// Node SSR en Vercel usa process.env en runtime
const getEnvVar = (nombre) => {
    if (typeof process !== "undefined" && process.env && process.env[nombre]) {
        return process.env[nombre];
    }
    if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[nombre]) {
        return import.meta.env[nombre];
    }
    return "";
};

const supabaseUrl = getEnvVar("SUPABASE_URL");
const supabaseKey = getEnvVar("SUPABASE_SERVICE_ROLE_KEY") || getEnvVar("SUPABASE_KEY");

// Creamos un cliente siempre para no romper los tipos de TS (Astro API routes)
// Si estamos en build step y no hay vars, usamos valores dummy válidos sintácticamente
const finalUrl = supabaseUrl || "https://dummy.supabase.co";
const finalKey = supabaseKey || "dummy-key";

export const supabase = createClient(finalUrl, finalKey);
