/*
    Alebrijes de Oaxaca Teotihuacán
    Cliente Supabase Centralizado

    Este módulo inicializa y exporta una única instancia del cliente Supabase
    para ser reutilizada en toda la aplicación. Usar CDN oficial de Supabase v2.
*/

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = 'https://wwpzmykgwathjwkcnrio.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3cHpteWtnd2F0aGp3a2NucmlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5NTg2MDAsImV4cCI6MjEwMzUzNDYwMH0.FLEgfUFYpzmMLU6EzAZ2EDGx15Ay4lwkieCz5GyUNkM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});
