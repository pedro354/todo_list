const taskModel = require('../models/taskModel');
const userModel = require('../models/userModel');
const authController = {
    loginPage: (req, res) => {
    const user = req.session.currentUser;
    res.render('pages/login', { user });
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
        res.render('pages/app', { user, tasks, message})
    },
    register: (req, res) => {
        const { name, email, password, confirmPassword } = req.body;

            if (!name || !email || !password || !confirmPassword) {
            return res.render('pages/register', {
                user: null,
                message: {
                    type: 'error',
                    text: 'Todos os campos são obrigatórios!'
                }
            });
        }
            if (userModel.findUserByEmail(email)) {
            return res.render('pages/register', {
                user: null,
                message: {
                    type: 'error',
                    text: 'Email já cadastrado!'
                }
            });
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
        res.redirect(302, "/auth/login");
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
        // 
            if (!email || !password) {
            return res.render('pages/login', {
                user: null,
                message: {
                    type: 'error',
                    text: 'Todos os campos são obrigatórios!'
                }
            });
        }

        const user = userModel.findUserByEmail(email)
        if (!user || user.password !== password) {
            return res.render('pages/login', {
                user: null,
                message: {
                type: 'error',
                text: 'Email ou senha inválidos!'
                }
            });
        }

        req.session.authenticated = true;
        req.session.currentUser = {
            id: user.userId ,
            name: user.name,
            email: user.email,
            guest: false
        }

        req.session.message = {
            type: 'success',
            text: 'Login realizado com sucesso!'
        }
        res.redirect(302, '/app');
    },
    loginForm: (req, res) => {
  console.log("Mensagem disponível na view:", res.locals.message);
  res.render('auth/login');
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
    },
    // GET /auth/forgetPassword
    forgetPasswordGET: (req, res) => {
        res.render('pages/forgetPassword', {message: null});
    },
    forgetPasswordPOST: (req, res) => {
        const {email} = req.body;

        if(!email){
            return res.render('pages/forgetPassword',
                 {message: {type: 'error', text: 'Email inválido!'}
            })
        }
        req.session.recoveryEmail = email;
        res.redirect('/auth/resetPassword');
    },
    resetPasswordGET: (req, res) => {
        const email = req.session.recoveryEmail;
        if(!email){
            return res.render('pages/forgetPassword', {message: null});
        }
        res.render('pages/resetPassword', {email, message: null});
    },
    resetPasswordPOST: (req, res) => {
        const {email, password, confirmPassword} = req.body;
        
        if(!email || !password || !confirmPassword){
            return res.render('pages/resetPassword', {
                email, 
                message: {
                    type: 'error', 
                    text: 'Todos os campos são obrigatórios!'
                }
            });
        }
        if(password !== confirmPassword){
            return res.render('pages/resetPassword', {
                email,
                message: {
                    type: 'error',
                    text: 'As senhas não conferem!'
                }
            });
        }
        const user = userModel.findUserByEmail(email);
        if(!user){
            return res.render('pages/resetPassword', {
                email,
                message: {
                    type: 'error',
                    text: 'Usuário não encontrado!'
                }
            });
        }
        user.password = password;
        userModel.saveUsers(user);
        req.session.message = {
            type: 'success',
            message: 'Senha alterada com sucesso!'
        }
        res.redirect('/auth/login');
    }
}

module.exports = authController;

