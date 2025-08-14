const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const path = require('path');
const routes = require('./routes');
const messageHandler = require('./middlewares/messageHandler');
const logger = require('./middlewares/logger');
const errorController = require('./controllers/errorController');
const errorHandler = require('./middlewares/errorHandler');
// instanciando o servidor
const app = express();
// configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ COOKIE SESSION (ainda melhor):
const cookieSession = require('cookie-session');

app.use(cookieSession({
    name: 'session',
    keys: [process.env.SESSION_SECRET],
    maxAge: 1000 * 60 * 60 * 24
}));
app.use(messageHandler);
app.use(logger);
// rotas principais
app.use(routes);
// tratamento de erros
app.use(errorController.notFound);
app.use(errorHandler)
// servidor

module.exports = app;
