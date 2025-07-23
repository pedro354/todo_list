const authMiddleware = (req, res, next) => {
    console.log('==== Verificação de Sessão ====');
    console.log('Auth:', req.session.authenticated);
    console.log('Guest:', req.session.currentUser?.guest);

    if (req.session.authenticated || req.session.currentUser?.guest) {
        console.log('✅ Acesso liberado!');
        return next();
    }

    console.log('⛔ Bloqueado, redirecionando para login');
    
    res.redirect('/auth/login');

};




module.exports = authMiddleware;