const TaskModel = require('../models/taskModel');
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationEmail } = require('../public/script/utls');
const authMiddleware = require('../middlewares/authMiddleware');

const authController = {

    loginPage: (req, res) => {
        const user = req.session.currentUser || null;
        res.render('pages/login', { user });
    },
    registerPage: async (req, res) => {
        const message = await req.session.message;
        delete req.session.message;
        res.render('pages/register', { message });
    },
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

    login: async (req, res) => {
        console.log("Login recebido:", req.body);
        const { email, password, loginType } = req.body

        // Login como convidado
        
        try {
            if (loginType === 'guest') {
                req.session.authenticated = true;
                req.session.currentUser = {
                    id: 0,
                    name: 'Convidado',
                    email: null,
                    guest: true
                }
                return res.redirect(302, '/app')
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


            res.redirect(302, '/app');

        } catch (error) {
            console.log("Erro no login:", error);
            req.session.message = {
                type: 'error',
                text: 'Erro ao fazer login!'
            }
            res.redirect('/auth/login');

        }
    },
    loginForm: (req, res) => {
        console.log("Mensagem disponível na view:", res.locals.message);
        res.render('auth/login');
    },

    logout: (req, res) => {
    console.log('===== LOGOUT =====');
    console.log('Usuário antes do logout:', req.session.currentUser);
    
    // Limpa toda a sessão
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao destruir sessão:', err);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
        
        console.log('Sessão destruída com sucesso');
        res.clearCookie('connect.sid')
        res.redirect('/auth/login');
    });
    },
    deleteAccount: async (req, res) => {
        const userId = req.session.currentUser?.id;

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
    resetPasswordGET: (req, res) => {
        const email = req.session.recoveryEmail;
        if (!email) {
            return res.render('pages/forgetPassword', { message: null });
        }
        res.render('pages/resetPassword', { email, message: null });
    },
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