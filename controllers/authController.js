const taskModel = require('../models/taskModel');
const userModel = require('../models/userModel');
const authController = {
    loginPage: (req, res) => {
    const user = req.session.currentUser;
    const loginError = req.session.loginError;
    const loginSuccess = req.session.loginSuccess;
    let message = req.session.message;

    // Limpa mensagens de sessão
    delete req.session.loginError;
    delete req.session.loginSuccess;
    delete req.session.message;

            

        if(req.query.msg === 'deleted') {
            message = {
                type: 'success',
                text: 'Tarefa deletada com sucesso!'
            }
            return res.redirect('/app');
        }
        res.render('pages/login', { user, loginError, loginSuccess, message });
    },
    registerPage: (req, res) => {
        const userId = req.session.userId;
        const message = req.session.message;
        delete req.session.message;
        res.render('pages/register', { userId, message });
    },
    index: (req, res) => {
        if (!req.session.authenticated) {
            return res.redirect('/auth/login');
        }
        const user = req.session.currentUser;
        res.render('pages/app', { user, tasks })
    },
    register: (req, res) => {

        const { name, email, password } = req.body;
        if (userModel.findUserByEmail(email)) {
            if (!name || !email || !password) {
                req.session.message = {
                    type: 'error',
                    text: 'Todos os campos são obrigatórios.'
                }
                return res.redirect('/auth/register');
            }

            req.session.message = {
                type: 'error',
                text: 'Email já cadastrado!'
            }
            return res.redirect('/auth/register')
        }
        const newUser = userModel.createUser({ name, email, password });

        req.session.authenticated = true;
        req.session.currentUser = {
            id: newUser.userId,
            name: newUser.name,
            email: newUser.email,
            guest: false
        }
        req.session.message = {
            type: 'success',
            text: 'Usuário cadastrado com sucesso!'
        };
        res.redirect(302, "/app");
    },

    login: (req, res) => {
        const {email, password, loginType } = req.body

        // Login como convidado
        if (loginType === 'guest') {
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
        if (!user || user.password !== password) {
            req.session.authenticated = false;
            req.session.loginError = "Email ou senha inválidos!";

            return res.redirect('/auth/login');

        }
        if (!email || !password) {
            req.session.loginError = "Preencha todos os campos!";
            return res.redirect('/auth/login');
        }

        // Verifica se o usuário existe e se a senha está correta        
        req.session.authenticated = true;

        req.session.currentUser = {
            id: user.userId ,
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
            res.redirect('/auth/login');
        });
    },
    deleteAccount: (req, res) => {
        const userId = req.session.currentUser?.id;
        
        if(!userId){
            req.session.message = {
                type: 'error',
                text: 'Não foi possível excluir sua conta!'
            }

            return res.redirect('/auth/login');
        }
        taskModel.deleteTaskByUserId(userId);
        userModel.deletedUser(userId);
        req.session.destroy(() => {
        res.redirect('/auth/login?msg=deleted');
        });
    }

}

module.exports = authController;

