const restrictToAuthenticated = require('./restrictToAuthenticated');
module.exports = (req, res, next) => {
    restrictToAuthenticated(req, res, () => {
        if (req.user.github) {
            return next();
        }
        return res.sendStatus(403);
    });
};
