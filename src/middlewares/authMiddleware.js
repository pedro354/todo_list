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
        return res.status(401).render('errors/401', {
            user: null,
            message: { type: 'error', text: 'Não autorizado' }
        });
    }
    
    // Se é convidado, liberar sem verificar JWT
    if (req.session.currentUser?.guest) {
        console.log('✅ Convidado autenticado, liberando acesso');
        return next();
    }
    
    // Se não é convidado, verificar JWT
    const token = req.session.token;
    if (!token) {
        console.log('Token não encontrado para usuário logado');
        return res.redirect('/auth/login');
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log('Token decodificado:', decoded);
        console.log('✅ Usuário JWT autenticado, liberando acesso');
        return next();
    } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return res.redirect('/auth/login');
    }
};

module.exports = authMiddleware;