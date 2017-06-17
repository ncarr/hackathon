module.exports = (err, req, res, next) => {
    if (err.code == 11000) {
        res.status(409).send("Already in database");
    } else {
        console.log(err);
        if (err.status) {
            console.log(err.status);
            return res.sendStatus(err.status);
        }
        res.sendStatus(400);
    }
}
