const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const path = require('path');
const router = require('./routes');
const messageHandler = require('./middlewares/messageHandler');
const logger = require('./middlewares/logger');
const errorController = require('./controllers/errorController');
const errorHandler = require('./middlewares/errorHandler');
// instanciando o servidor
const app = express();
// configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))
// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
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
app.use(router);
// tratamento de erros
app.use(errorController.notFound);
app.use(errorHandler)
// servidor

    const PORT = process.env.PORT || 'https://todo-list-2cfs.onrender.com';
    app.listen(PORT, () => console.log(`Servidor Inciado em http://localhost:${PORT}`));

module.exports = app;
