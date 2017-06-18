const restrictToAuthenticated = require('./restrictToAuthenticated');
module.exports = role => (req, res, next) => {
    restrictToAuthenticated(req, res, () => {
        if (req.user.roles.includes(role)) {
            return next();
        }
        return res.sendStatus(403);
    });
}
