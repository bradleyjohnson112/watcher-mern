const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/users', require('./routes/users'));
app.use('/api/shows', require('./routes/shows'));
module.exports = app;