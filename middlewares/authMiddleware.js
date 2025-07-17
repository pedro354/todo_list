const authMiddleware = (req, res, next) => {
    if(req.session.authenticated || req.session.isGuest){
        return next();
    }
    res.redirect('/auth/login');
};


module.exports = authMiddleware;