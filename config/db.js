const axios = require('axios');

const supabaseUrl = process.env.SUPABASE_URL || 'https://ceqecfynuhfwnyvskbhh.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlcWVjZnludWhmd255dnNrYmhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyOTM1MjksImV4cCI6MjA1Nzg2OTUyOX0.CauX504x7KszJUGo9YRskyr2fvTLr-Mkg59vbR8i2xE';

const db = {
    query: async (sql, params) => {
        try {
            if (sql.includes('INSERT INTO')) {
                const table = sql.match(/INTO (\w+)/i)?.[1];
                if (!table) throw new Error('No table found in INSERT query');
                const data = {};
                const fields = sql.match(/\(([^)]+)\)/)[1].split(', ').map(f => f.trim());
                params.forEach((val, idx) => (data[fields[idx]] = val));
                const res = await axios.post(`${supabaseUrl}/rest/v1/${table}`, data, {
                    headers: {
                        'apikey': supabaseKey,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation' // Ensures inserted data is returned
                    }
                });
                return [{ insertId: res.data[0].id }];
            } else {
                const table = sql.match(/FROM (\w+)/i)?.[1];
                if (!table) throw new Error('No table found in SELECT query');
                const res = await axios.get(`${supabaseUrl}/rest/v1/${table}`, {
                    headers: { 'apikey': supabaseKey }
                });
                return [res.data];
            }
        } catch (err) {
            throw new Error(`Database error: ${err.response?.data?.message || err.message}`);
        }
    }
};

module.exports = db;