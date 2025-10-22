const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const TaskModel = require('../models/TaskModel');
const { validationEmail } = require('../../public/script/utls.js');

const authController = {
    // GET /auth/login
    loginPage: (req, res) => {
        const user = req.session.currentUser || null;
        res.render('pages/login', { user });
    },
    // GET /auth/register
    registerPage: async (req, res) => {
        const message = await req.session.message;
        delete req.session.message;
        res.render('pages/register', { message });
    },
    // GET /app
    index: async (req, res) => {
        if (!req.session.authenticated) {
            return res.redirect('/auth/login');
        }
        const user = req.session.currentUser;
        console.log("Usuário logado:", user);
        const message = req.session.message;
        delete req.session.message;
        const tasks = user.guest ? [] : await TaskModel.findTasksByUserId(user.id);
        res.render('pages/app', { user, tasks, message })
    },
    // POST /auth/register
    register: async (req, res) => {

        try {

            const { username, email, password, confirmPassword } = req.body;
            console.log("Dados recebidos", req.body);


            if (!username || !email || !password || !confirmPassword) {
                console.log("Erro ao cadastrar usuário: Campos obrigatórios não preenchidos.");
                return res.render('pages/register', {
                    user: null,
                    message: {
                        type: 'error',
                        text: 'Todos os campos são obrigatórios!'
                    }
                });

            }
            const exists = await UserModel.findUserByEmail(email);
            console.log("Usuário já existe?", exists);

            const dominio = email.split('@')[1];
            const dominioValidate = await validationEmail(dominio);
            console.log("Validação do email:", dominioValidate);
            if (!dominioValidate) {
                return res.render('pages/register', {
                    user: null,
                    message: {
                        type: 'error',
                        text: 'Domínio de email inválido ou inexistente!'
                    }
                });
            }

            if (exists) {
                return res.render('pages/register', {
                    user: null,
                    message: {
                        type: 'error',
                        text: 'Email já cadastrado!'
                    }
                });
            }
            if (password !== confirmPassword) {
                return res.render('pages/register', {
                    user: null,
                    message: {
                        type: 'error',
                        text: 'As senhas não conferem!'
                    }
                });
            }

            const regexVerification = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/
            const messageText = ` 
            <div class="msgPass">
            <strong>A senha precisa ter no minímo:</strong><br>
            <ul>
            <li class="valid-item"> 8 Caracteres</li>
            <li class="valid-item">1 Letra Maiúscula</li>
            <li class="valid-item">1 Letra Minuscula</li>
            <li class="valid-item">1 Caractere Especial</li>
            <li class="valid-item">1 Número</li>
            </ul>
            </div>
            
            `

            if (!regexVerification.test(password)) {
                return res.render('pages/register', {
                    user: null,
                    message: {
                        type: 'error',
                        text: messageText
                    }
                });
            }
            // Criar o novo usuário com a senha criptografada
            const newUser = await UserModel.createUser({
                username,
                email,
                password
            });

            console.log("Novo usuário criado:", newUser);

            req.session.authenticated = true;
            req.session.currentUser = {
                id: newUser.userId,
                username: newUser.username,
                email: newUser.email,
                guest: false
            }
            req.session.message = {
                type: 'success',
                text: 'Usuário cadastrado com sucesso!'
            };
            res.redirect(302, "/auth/login");


        } catch (error) {
            console.log("Erro no register:", error);

            return res.render('pages/register', {
                user: null,
                message: {
                    type: 'error',
                    text: error.message
                }
            });
        }
    },
    // POST /auth/login
    login: async (req, res) => {
        console.log("Login recebido:", req.body);
        const { email, password, loginType } = req.body

        // Login como convidado

        try {
            if (loginType === 'guest') {
                req.session.authenticated = true;
                req.session.currentUser = {
                    id: 0,
                    username: 'Convidado',
                    email: null,
                    guest: true
                }
                return res.redirect('/app')
            }
            // verificar se o usuário existe
            if (!email || !password) {
                console.log("Campos faltando");
                return res.render('pages/login', {
                    user: null,
                    message: { type: 'error', text: 'Todos os campos são obrigatórios!' }
                });
            }

            const user = await UserModel.findUserByEmail(email);
            console.log("Usuário encontrado:", user);

            if (!user) {
                console.log("Email não encontrado");
                return res.render('pages/login', {
                    user: null,
                    message: { type: 'error', text: 'Email não encontrado!' }
                })

            }

            const senhaConfere = await bcrypt.compare(password, user.password);

            if (!senhaConfere) {
                console.log("Senha inválida!");
                return res.render('pages/login', {
                    user: null,
                    message: { type: 'error', text: 'Email ou senha inválidos!' }
                });
            }
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '2h' }
            );
            req.session.authenticated = true;
            req.session.currentUser = {
                id: user.id,
                username: user.username,
                email: user.email,
                guest: false
            }
            req.session.token = token;
            console.log("Login realizado com sucesso!");
            console.log(req.session);


            res.redirect('/app');

        } catch (error) {
            console.log("Erro no login:", error);
            req.session.message = {
                type: 'error',
                text: 'Erro ao fazer login!'
            }
            res.redirect('/auth/login');

        }
    },
    // GET /auth/login
    loginForm: (req, res) => {
        console.log("Mensagem disponível na view:", res.locals.message);
        res.render('auth/login');
    },
    // POST /auth/logout
    logout: (req, res) => {
        console.log('===== LOGOUT =====');
        console.log('Usuário antes do logout:', req.session.currentUser);

        try {
            const userId = req.session?.currentUser?.id;

            req.session.authenticated = false;
            req.session.currentUser = null;

            req.session = null;

            console.log('Usuário após o logout:', req.session?.currentUser);

            res.set({
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            })
            console.log("Redirecionando para /auth/login");
            res.redirect('/auth/login')

        } catch (error) {
            console.error('Erro durante o logout:', error);
            res.status(500).send('Erro ao fazer logout!');

        }

    },
    // POST /auth/deleteAccount
    deleteAccount: async (req, res) => {
        const userId = req.session.currentUser?.id;
        const isGuest = req.session.currentUser?.guest;

        if (isGuest) {
            req.session.message = {
                type: 'error',
                text: 'Usuário convidado não pode excluir conta!'
            }
            return res.redirect('/auth/login');
        }
        if (!userId) {
            req.session.message = {
                type: 'error',
                text: 'Não foi possível excluir sua conta!'
            }

            return res.redirect('/auth/login');
        }
        await TaskModel.deleteAllTasksByUser(userId);
        await UserModel.deleteUser(userId);
        req.session.destroy(() => {
            res.redirect('/auth/login?msg=deleted');
        });
    },
    
    // GET /auth/forgetPassword
    forgetPasswordGET: (req, res) => {
        res.render('pages/forgetPassword', { message: null });
    },
    // POST /auth/forgetPassword
    forgetPasswordPOST: (req, res) => {
        const { email } = req.body;

        if (!email) {
            return res.render('pages/forgetPassword',
                {
                    message: { type: 'error', text: 'Email inválido!' }
                })
        }
        req.session.recoveryEmail = email;
        res.redirect('/auth/resetPassword');
    },
    // GET /auth/resetPassword
    resetPasswordGET: (req, res) => {
        const email = req.session.recoveryEmail;
        if (!email) {
            return res.render('pages/forgetPassword', { message: null });
        }
        res.render('pages/resetPassword', { email, message: null });
    },
    // POST /auth/resetPassword
    resetPasswordPOST: (req, res) => {
        const { email, password, confirmPassword } = req.body;

        if (!email || !password || !confirmPassword) {
            return res.render('pages/resetPassword', {
                email,
                message: {
                    type: 'error',
                    text: 'Todos os campos são obrigatórios!'
                }
            });
        }
        if (password !== confirmPassword) {
            return res.render('pages/resetPassword', {
                email,
                message: {
                    type: 'error',
                    text: 'As senhas não conferem!'
                }
            });
        }
        const user = UserModel.findUserByEmail(email);
        if (!user) {
            return res.render('pages/resetPassword', {
                email,
                message: {
                    type: 'error',
                    text: 'Usuário não encontrado!'
                }
            });
        }
        user.password = password;
        UserModel.saveUser(user);
        req.session.message = {
            type: 'success',
            message: 'Senha alterada com sucesso!'
        }
        res.redirect('/auth/login');
    }
}

module.exports = authController;