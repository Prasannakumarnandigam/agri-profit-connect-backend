const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.post('/add', async (req, res) => {
    const { farmer_id, crop_name, quantity, price_per_unit, location } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO crops (farmer_id, crop_name, quantity, price_per_unit, location) VALUES (?, ?, ?, ?, ?)',
            [farmer_id, crop_name, quantity, price_per_unit, location]
        );
        res.status(201).json({ message: 'Crop added', cropId: result.insertId });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/all', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM crops WHERE status = "available"');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/my-listings', async (req, res) => {
    const { farmer_id } = req.query;
    try {
        const [rows] = await db.query('SELECT * FROM crops WHERE farmer_id = ?', [farmer_id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;