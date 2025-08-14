require('dotenv').config();
const cors = require('cors');
const express = require('express');
const path = require('path');
const router = require('../src/routes');
const messageHandler = require('../src/middlewares/messageHandler');
const logger = require('../src/middlewares/logger');
const errorController = require('../src/controllers/errorController');
const errorHandler = require('../src/middlewares/errorHandler');

// instanciando o servidor
const app = express();

// configurações para o cors
const vercelFrontEndUrl = "https://todo-list-2cfs.onrender.com";
const corsOptions = {
    origin: [vercelFrontEndUrl, 'http://localhost:3000'],
    credentials: true,
}
app.use(cors(corsOptions));

// configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

// middlewares
app.use(express.urlencoded({ extended: true }));
// Servindo arquivos estáticos
app.use(express.static(path.join('public')))

// configuração do cookie-session
const cookieSession = require('cookie-session');
app.use(cookieSession({
    name: 'session',
    keys: [process.env.SESSION_SECRET],
    maxAge: 1000 * 60 * 60 * 24
}));
app.use(messageHandler);
app.use(logger);

// Rotas
app.use(router);

// Tratamento de erros
app.use(errorController.notFound);
app.use(errorHandler)

const PORT = process.env.PORT || 3000;
const PORT_RENDER = process.env.PORT_RENDER || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}/`);
    console.log(`Server is running on port ${PORT_RENDER}`);

});
