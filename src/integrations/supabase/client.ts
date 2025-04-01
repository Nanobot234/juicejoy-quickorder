
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ekikkxpdqmefsxxabfdm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVraWtreHBkcW1lZnN4eGFiZmRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MTkzODEsImV4cCI6MjA1NzI5NTM4MX0.uwPOn2DLPF7it7uqzpupDmt8PlTFh-IVcqdPL2z9880";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: localStorage
  }
});
