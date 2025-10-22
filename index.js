require('dotenv-flow').config();
const express = require('express');
const cookieSession = require('cookie-session');
const path = require('path');
const router = require('./src/routes');
const messageHandler = require('./src/middlewares/messageHandler');
const logger = require('./src/middlewares/logger');
const errorController = require('./src/controllers/errorController');
const errorHandler = require('./src/middlewares/errorHandler');

// instanciando o servidor
const app = express();


// configurações
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));
// Servindo arquivos estáticos
app.use(express.static(path.join(process.cwd(), 'public')));

// middlewares
app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', 1);

// Configuração de sessão
app.use(cookieSession({
    name: 'session',
    keys: [process.env.SESSION_SECRET || 'fallback-secret'],
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
}));
app.use(messageHandler);
app.use(logger);


// Rotas
app.use(router);

// Tratamento de erros
app.use(errorController.notFound);
app.use(errorHandler)

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Server running on 0.0.0.0:${port}`);
});

app.use((err, req, res, next) => {
    console.error('Error: ', err);
    res.status(500).send('Internal Server Error!');

});