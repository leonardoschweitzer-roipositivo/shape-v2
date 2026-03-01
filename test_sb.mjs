import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://jvqwhebxbenxbwabizhy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2cXdoZWJ4YmVueGJ3YWJpemh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3Mzk2OTEsImV4cCI6MjA4NjMxNTY5MX0.Kqq2nnvpq36VnMZTArccgCKlvQh5aMKxdGZRpscxtUk');
supabase.from('planos_treino').select('id, diagnostico_id').then(res => console.log("treino", res.data?.length, res.error));
