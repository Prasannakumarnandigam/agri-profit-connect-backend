const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password, phone, user_type, location } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, phone, user_type, location) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, phone, user_type, location]
        );
        res.status(201).json({ message: 'User registered', userId: result.insertId });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.json({ id: user.id, user_type: user.user_type });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;