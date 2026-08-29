/*
    Alebrijes de Oaxaca Teotihuacán
    Cliente Supabase Centralizado

    Este módulo inicializa y exporta una única instancia del cliente Supabase
    para ser reutilizada en toda la aplicación. Usar CDN oficial de Supabase v2.
*/

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = 'https://jreixcvqsrrngmbwvyof.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyZWl4Y3Zxc3JybmdtYnd2eW9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5NTUwNTksImV4cCI6MjEwMzUzMTA1OX0.aboaxJwBMTPTWJI1HfdBfZe-W_v3UslIF0SbQbFCIuQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});
