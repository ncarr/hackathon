const path = require('path');
module.exports = (err, req, res, next) => {
    if (err.url) {
        res.status(err.status).sendFile(path.join(__dirname + "/" + err.url));
    } else if (err.code == 11000) {
        res.status(409).send("Already in database");
    } else {
        console.log(err);
        if (err.status) {
            return res.sendStatus(err.status);
        }
        res.sendStatus(400);
    }
};
module.exports.ServerError = require('./ServerError');
