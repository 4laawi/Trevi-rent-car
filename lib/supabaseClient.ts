import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gwqwcqleknpymjnihosv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3cXdjcWxla25weW1qbmlob3N2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2ODE4NTIsImV4cCI6MjA4MDI1Nzg1Mn0.ll4zK7dzw2hfJ1tF9Nz-Jl27XNLamRdKn1nmU9v9HNc';

export const supabase = createClient(supabaseUrl, supabaseKey);