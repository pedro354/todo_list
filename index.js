require('dotenv').config();
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
app.set('views', path.join(__dirname, 'views'));
// Servindo arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// middlewares
app.use(express.urlencoded({ extended: true }));


// configuração do cookie-session
app.use(cookieSession({
    name: 'session',
    keys: [process.env.SESSION_SECRET || 'fallback-secret'],
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
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
app.use((err, req, res, next)=>{
    console.error('Error: ', err);
    res.status(500).send('Internal Server Error!');
    
})

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Server running on 0.0.0.0:${port}`);
});