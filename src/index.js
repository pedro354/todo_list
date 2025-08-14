require('dotenv').config();
const cors = require('cors');
const express = require('express');
const path = require('path');
const router = require('./routes');
const messageHandler = require('./middlewares/messageHandler');
const logger = require('./middlewares/logger');
const errorController = require('./controllers/errorController');
const errorHandler = require('./middlewares/errorHandler');

// instanciando o servidor
const app = express();

// configurações para o cors
const vercelFrontEndUrl = `https://todo-list-gold-chi.vercel.app/`
const corsOptions = {
    origin: [vercelFrontEndUrl, 'http://localhost:3000'],
    credentials: true,
}
app.use(cors(corsOptions));

// configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))
// Servindo arquivos estáticos
// middlewares
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
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

const PORT = process.env.PORT
const URL_RENDER = process.env.NEXT_PUBLIC_API_URL || PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}/`);
    console.log(`Server is running on port ${URL_RENDER}`);

});
