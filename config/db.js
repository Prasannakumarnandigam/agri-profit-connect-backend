const axios = require('axios');

const supabaseUrl = 'https://ceqecfynuhfwnyvskbhh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlcWVjZnludWhmd255dnNrYmhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyOTM1MjksImV4cCI6MjA1Nzg2OTUyOX0.CauX504x7KszJUGo9YRskyr2fvTLr-Mkg59vbR8i2xE';

const db = {
    query: async (sql, params) => {
        const [table] = sql.match(/FROM (\w+)/i)?.[1] || [];
        if (sql.includes('INSERT INTO')) {
            const data = {};
            const fields = sql.match(/\(([^)]+)\)/)[1].split(', ');
            params.forEach((val, idx) => (data[fields[idx]] = val));
            const res = await axios.post(`${supabaseUrl}/rest/v1/${table}`, data, {
                headers: { 'apikey': supabaseKey, 'Content-Type': 'application/json' }
            });
            return [{ insertId: res.data[0].id }];
        } else {
            const res = await axios.get(`${supabaseUrl}/rest/v1/${table}`, {
                headers: { 'apikey': supabaseKey }
            });
            return [res.data];
        }
    }
};

module.exports = db;