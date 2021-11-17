const express = require('express');

const app = express();

const router = require('./routes');

app.use('/qa', router);

module.exports = { app };
