const discord = require('./discord');

const express = require('express');
const app = express();

app.use('/connect/discord', discord)

app.listen(8000);
