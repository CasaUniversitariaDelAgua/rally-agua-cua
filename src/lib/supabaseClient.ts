// src/lib/supabaseClient.ts
// Cliente ligero para uso en el browser (React islands)
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL as string;
const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, key);
