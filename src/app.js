'use strict';

const path = require('path');
const serveStatic = require('feathers').static;
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const bodyParser = require('body-parser');
const socketio = require('feathers-socketio');
const primus = require('feathers-primus');
const middleware = require('./middleware');
const services = require('./services');
const webPush = require('web-push');
const errorHandler = require('feathers-errors/handler');

const app = feathers();

app.configure(configuration(path.join(__dirname, '..')));

app.use(compress())
  .options('*', cors())
  .use(cors())
  .use(favicon( path.join(app.get('public'), 'favicon.ico') ))
  .use('/', serveStatic( app.get('public') ))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(hooks())
  .configure(rest())
  .configure(socketio())
  .configure(primus({ transformer: 'websockets' }));

  webPush.setGCMAPIKey(app.get('GCM_API_KEY'));
  webPush.setVapidDetails(
    'mailto:nicholas.carr@rogers.com',
    app.get('vapidPublicKey'),
    app.get('vapidPrivateKey')
  );

  var webPushServer = feathers.Router();
  webPushServer.post('/register', function(req, res) {
    // A real world application would store the subscription info.
    app.service('webpushclients').create({ data: req.body }).then(function (result) {
      res.sendStatus(201);
    });
  });

  webPushServer.post('/blast', function(req, res) {
    app.service('webpushclients').find().then(function (result) {
      console.log(result.data);
      result.data.forEach(function (endpoint) {
        webPush.sendNotification(endpoint.data, req.body.data)
          .then(function() {
            res.sendStatus(201);
          });
      });
    });
  });

  app.use('/webpush', webPushServer);

  app.configure(services)
    .configure(middleware)
    .use(errorHandler);

module.exports = app;
