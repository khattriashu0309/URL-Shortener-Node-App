const express = require('express');
const connectDB = require('./config/db');
const urlRoutes = require('./routes/urlRoutes');
const errorHandler = require('./middlewares/errorHandler');
require('dotenv').config();
const app = express();
connectDB();
app.use(express.json());
app.use('/', urlRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));