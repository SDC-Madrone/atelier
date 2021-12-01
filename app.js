const express = require('express');

const app = express();

const router = require('./controllers');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/qa', router);

module.exports = app;
