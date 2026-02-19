// Migration script: reads data.json and inserts users into Supabase 'users' table.
// Usage: set SUPABASE_URL and SUPABASE_KEY in env, then run `node migrate_to_supabase.js`
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const dataPath = path.join(__dirname, 'data.json');
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error('Please set SUPABASE_URL and SUPABASE_KEY in environment');
  process.exit(1);
}
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const bcrypt = require('bcryptjs');

async function main(){
  const raw = fs.readFileSync(dataPath, 'utf8');
  const obj = JSON.parse(raw || '{}');
  const users = obj.users || [];
  console.log('Found', users.length, 'users to migrate');
  for (const u of users){
    const insert = Object.assign({}, u);
    // ensure purchased_packages is string
    if (Array.isArray(insert.purchased_packages)) insert.purchased_packages = JSON.stringify(insert.purchased_packages);
    // if plain password exists, hash it and store as parola_hash; remove plain parola
    if (insert.parola) {
      try {
        const h = await bcrypt.hash(String(insert.parola), 10);
        insert.parola_hash = h;
        delete insert.parola;
      } catch (e) { console.warn('Failed hashing for', insert.cont); }
    }
    try{
      const { data, error } = await supabase.from('users').insert(insert).select();
      if (error) console.error('Error inserting', u.cont, error.message);
      else console.log('Inserted', u.cont);
    }catch(e){ console.error('Insert threw for', u.cont, e.message); }
  }
}

main().then(()=>console.log('Done')).catch(e=>console.error(e));
