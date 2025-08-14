require('dotenv').config();
const cors = require('cors');
const express = require('express');
const path = require('path');
const router = require('./src/routes');
const messageHandler = require('./src/middlewares/messageHandler');
const logger = require('./src/middlewares/logger');
const errorController = require('./src/controllers/errorController');
const errorHandler = require('./src/middlewares/errorHandler');

// instanciando o servidor
const app = express();

// configurações para o cors
const corsOptions = {
  origin: ['https://todo-list-gold-chi.vercel.app'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cors(corsOptions));

// configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'))
// Servindo arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
// middlewares
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

app.use((err, req, res, next)=>{
    console.error('Error: ', err);
    res.status(500).send('Internal Server Error');
    
})

// Rotas
app.use(router);

// Tratamento de erros
app.use(errorController.notFound);
app.use(errorHandler)

const PORT = process.env.PORT;
const URL_RENDER = process.env.NEXT_PUBLIC_API_URL;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}/`);
    console.log(`Server is running on port ${URL_RENDER}`);
});
