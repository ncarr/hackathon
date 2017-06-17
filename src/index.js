const MONGO_URL = require('../config/mongodb').URL;
const path = require('path');

const mongoose = require('mongoose');
mongoose.connect(MONGO_URL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.Promise = global.Promise;

const handler = require('./errors');
const discord = require('./discord');
const webpush = require('./webpush');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use('/connect/discord', discord);
app.use('/webpush', webpush)
app.use(handler)

app.listen(8000);
