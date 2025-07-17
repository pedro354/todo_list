const path = require('path')
const fs = require('fs')
const userDBPath = path.join(process.cwd(), 'data', 'users.json');

function readUsers() {
    try {
        const data = fs.readFileSync(userDBPath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        console.error("Erro ao ler users.json", error);
        return []
    }
}
function writeUsers(users) {
    try {
        fs.writeFileSync(userDBPath, JSON.stringify(users, null, 2), 'utf-8');
    } catch (err) {
        console.error("Erro ao salvar no users.json:", err);
    }
}

const authController = {
    loginPage: (req, res) => {
        const message = req.session.message;
        delete req.session.message;
        const loginError = req.session.loginError;
        delete req.session.loginError;
        const loginSuccess = req.session.loginSuccess;
        delete req.session.loginSuccess;
        res.render('pages/login', {
            message,
            loginError,
            loginSuccess
        });
    },

    index: (req, res) => {
        res.render('pages/home')
    },
    register: (req, res) => {
        const { email, password } = req.body
        const users = readUsers()

        const userAlreadyExists = users.find(user => user.email === email)

        if (userAlreadyExists) {
            req.session.message = "Email já cadastrado!"
            return res.redirect('/auth/login')
        }

        const newUser = { email, password }
        users.push(newUser)
        writeUsers(users)


        req.session.authenticated = true;
        req.session.currentUser = {email, password};
        req.session.message = "Cadastro realizado com sucesso!";
        res.redirect('/app')
    },

    login: (req, res) => {
        const { email, password, loginType } = req.body

        // Login como convidado
        if(loginType === 'guest'){
            req.session.authenticated = true;
            req.session.currentUser = {name: 'Convidado', guest: true}
            return res.redirect(302, '/app')
        }
        // Login como usuário
        const users = readUsers()
        const user = users.find(user => user.email === email && user.password === password)

        if(!user){
            req.session.authenticated = false;
            req.session.loginError = "Email ou senha inválidos!";
            return res.redirect('/auth/login');
        }
        
        req.session.authenticated = true;
        req.session.currentUser = {email: user.email}
        req.session.loginSuccess = "Login realizado com sucesso!"
        res.redirect(302, '/app')

    },
    logout: (req, res) => {
        req.session = null
        res.redirect('/home')
    }
}

module.exports = authController