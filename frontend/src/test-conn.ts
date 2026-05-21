import { supabase } from './lib/supabase';

async function test() {
  console.log('Testing connection to Supabase...');
  try {
    const { data, error } = await supabase.from('clientes').select('*').limit(1);
    if (error) {
      console.error('Error fetching clientes:', error);
    } else {
      console.log('Success! Fetched clientes:', data);
    }
  } catch (err) {
    console.error('Caught error:', err);
  }
}

test();
