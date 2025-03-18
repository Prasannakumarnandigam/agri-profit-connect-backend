const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.post('/make', async (req, res) => {
    const { crop_id, agency_id, offered_price } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO offers (crop_id, agency_id, offered_price) VALUES (?, ?, ?)',
            [crop_id, agency_id, offered_price]
        );
        res.status(201).json({ message: 'Offer made', offerId: result.insertId });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/my-offers', async (req, res) => {
    const { user_id, user_type } = req.query;
    try {
        const query = user_type === 'farmer'
            ? 'SELECT o.*, c.crop_name FROM offers o JOIN crops c ON o.crop_id = c.id WHERE c.farmer_id = ?'
            : 'SELECT o.*, c.crop_name FROM offers o JOIN crops c ON o.crop_id = c.id WHERE o.agency_id = ?';
        const [rows] = await db.query(query, [user_id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await db.query('UPDATE offers SET status = ? WHERE id = ?', [status, id]);
        if (status === 'accepted') {
            await db.query('UPDATE crops SET status = "sold" WHERE id = (SELECT crop_id FROM offers WHERE id = ?)', [id]);
        }
        res.json({ message: 'Offer updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;