const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const cropRoutes = require('./routes/crops');
const offerRoutes = require('./routes/offers');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/crops', cropRoutes);
app.use('/offers', offerRoutes);

const PORT = process.env.PORT || 5000; // Use Render's port or 5000 locally
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));