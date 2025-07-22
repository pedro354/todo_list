const userModel = require('../models/userModel.js')
const authController = {
    loginPage: (req, res) => {
        const user = req.session.currentUser;
        res.render('pages/login', { user });
    },

    index: (req, res) => {
        if(!req.session.authenticated){
            return res.redirect('/auth/login');
        }
        const user = req.session.currentUser;
        res.render('pages/app', {user})
    },
    register: (req, res) => {
        const { name, email, password } = req.body

        if(userModel.findUserByEmail(email)){
            req.session.message = "Email já cadastrado!"
            return res.redirect('/auth/register')
        }

        const newUser = userModel.createUser({ name, email, password })
        req.session.authenticated = true;
        req.session.currentUser = {
            name: newUser.name,
            email: newUser.email,
            guest: false
        }
        req.session.message = "Usuário cadastrado com sucesso!"
        res.redirect(302, "/app");
    },

    login: (req, res) => {
        const { email, password, loginType } = req.body

        // Login como convidado
        if(loginType === 'guest'){
            req.session.authenticated = true;
            req.session.currentUser = {
                name: 'Convidado',
                email: null,
                guest: true
            }
            return res.redirect(302, '/app')
        }
        // Login como usuário
        const user = userModel.findUserByEmail(email)
        if(!user || user.password !== password){
            req.session.authenticated = false;
            req.session.loginError = "Email ou senha inválidos!";
            return res.redirect('/auth/login');
        }
        // Verifica se o usuário existe e se a senha está correta        
        req.session.authenticated = true;

        req.session.currentUser = {
            name: user.name,
            email: user.email,
            guest: false
        }
        req.session.loginSuccess = "Login realizado com sucesso!";
        res.redirect(302, '/app');
    },

logout: (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao encerrar sessão:', err);
            return res.status(500).send("Erro ao sair");
        }
        res.redirect('/home');
    });
}
}

module.exports = authController;