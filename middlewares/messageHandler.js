function messageHandler(req, res, next) {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
}

module.exports = messageHandler;