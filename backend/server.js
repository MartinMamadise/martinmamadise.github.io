require('dotenv').config(); // MUST be first — loads .env before anything else reads process.env

const express = require('express');
const cors    = require('cors');

const contactRoutes = require('./routes/contact.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/contact', contactRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
