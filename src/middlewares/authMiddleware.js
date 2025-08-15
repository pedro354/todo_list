const jwt = require('jsonwebtoken');
const authMiddleware = (req, res, next) => {
    console.log('==== Verificação de Sessão ====');
    console.log('Auth:', req.session.authenticated);
    console.log('Guest:', req.session.currentUser?.guest);

    const rotasPermitidas = ['/', '/login', '/auth/login', '/register', '/auth/register'];

    if(rotasPermitidas.includes(req.path)) {
        return next();
    }

    if (!req.session.authenticated) {
    return res.status(401).render('/errors/401', {
        user: null,
        message: { type: 'error', text: 'Não autorizado' }
    });
    }

    if (req.session.authenticated || req.session.currentUser?.guest) {
        const token = req.session.token;
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = decoded;
                console.log('Token decodificado:', decoded);
            } catch (error) {
                console.error('Erro ao decodificar o token:', error);
                return res.redirect('/auth/login');
            }
        }
        console.log('✅ Acesso liberado via sessão!');
        return next();
    }
    console.log('⛔ Bloqueado, redirecionando para login');
    return res.status(401).render('/errors/401', { message: 'Não autorizado' });
};


module.exports = authMiddleware;