const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const messageHandler = require('./middlewares/messageHandler');
const router = require('./router');
const { default: logger } = require('./middlewares/logger');
const errorController = require('./controllers/errorController');
const { default: errorHandler } = require('./middlewares/errorHandler');
// instanciando o servidor
const app = express();
// configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
        path: './database/sessions',
        retries: 1
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } 
}));
app.use(messageHandler);
app.use(logger);
// arquivos estáticos
app.use('/script', express.static(path.join(__dirname, 'public/script')));

// rotas principais
app.use(router);
// tratamento de erros
app.use(errorController.notFound);
app.use(errorHandler)
// servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>  {console.log(`Servidor http://localhost:${PORT}`)})

module.exports = app;

