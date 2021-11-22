const express = require('express');

const app = express();

const router = require('./controllers');

app.use(express.json({ extended: false }));

app.use('/qa', router);

module.exports = app;
