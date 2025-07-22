const authMiddleware = (req, res, next) => {
    const user = req.session.currentUser;
    if(req.session.authenticated || (user && user.guest)) {
        return next();
    }    console.log("Bloqueado pelo middleware");
    res.redirect('/auth/login');
}

module.exports = authMiddleware;