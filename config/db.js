const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'prasanna', // Replace with your MySQL password
    database: 'agri_profit_connect'
});

module.exports = db;