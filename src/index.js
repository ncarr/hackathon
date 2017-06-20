const MONGO_URL = require('../config/mongodb').URL;
const SESSION_SECRET = require('../config/mymlh').SESSION_SECRET;
const path = require('path');
const Event = require('./models/event');

const restrictToAuthenticated = require('./auth/restrictToAuthenticated');

const mongoose = require('mongoose');
mongoose.connect(MONGO_URL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.Promise = global.Promise;

const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const handler = require('./errors');
const mymlh = require('./mymlh');
const discord = require('./discord');
const github = require('./github');
const api = require('./api');
const webpush = require('./webpush');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(session({
    secret: SESSION_SECRET,
    name: 'generichacks.sid',
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({ mongooseConnection: db })
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/auth/mymlh', mymlh);
app.use('/connect/discord', discord);
app.use('/connect/github', github.auth);
app.use('/github', github.api);
app.use('/api', api)
app.use('/webpush', webpush);
app.get('/dashboard', restrictToAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname + '/views/dashboard.html'));
});
app.use(handler);

app.listen(8000);
