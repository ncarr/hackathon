const webPush = require('web-push');
const express = require('express');
const config = require('../../config/webpush');

const PushSubscription = require('./models/PushSubscription');
const PushMessage = require('./models/PushMessage');

const app = express.Router();

webPush.setGCMAPIKey(config.GCM_API_KEY);
webPush.setVapidDetails(
    config.VAPID_CONTACT_URI,
    config.VAPID_PUBLIC_KEY,
    config.VAPID_PRIVATE_KEY
);

app.post('/register', (req, res, next) => {
    PushSubscription.create({ data: req.body })
        .then(subs => res.sendStatus(201))
        .catch(next);
});

app.post('/blast', (req, res, next) => {
    PushMessage.create({ data: req.body.data })
        .then(msg => {
            return PushSubscription.find().exec()
                .then(subs => {
                    return Promise.all(subs.map(subscriber => {
                        webPush.sendNotification(subscriber.data.data, req.body.data)
                            .catch(err => {
                                console.log(err);
                                msg.failedRecipients.push(subscriber._id);
                                return msg.save();
                            })
                            .then(res => {
                                msg.recipients.push(subscriber._id);
                                return msg.save();
                            });
                    }));
                })
                .then(responses => res.sendStatus(201));
        })
        .catch(next);
});

module.exports = app;
