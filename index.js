require('dotenv').config();
const cors = require('cors');
const express = require('express');
const cookieSession = require('cookie-session');
const path = require('path');
const router = require('./src/routes');
const messageHandler = require('./src/middlewares/messageHandler');
const logger = require('./src/middlewares/logger');
const errorController = require('./src/controllers/errorController');
const errorHandler = require('./src/middlewares/errorHandler');
const { testConnection } = require ('./database/db')

// instanciando o servidor
const app = express();


// configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/'));
// Servindo arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
// configurações para o cors
// ✅ CORS simplificado (mesmo domínio)
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://127.0.0.1:5500", // ou onde roda seu HTML
  credentials: true,
};

app.use(cors(corsOptions));

// middlewares
app.use(express.json({ limit: '10mb' }));
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

app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV 
    });
});

// Rotas
app.use(router);
app.use((err, req, res, next)=>{
    console.error('Error: ', err);
    res.status(500).send('Internal Server Error');
    
})

// Tratamento de erros
app.use(errorController.notFound);
app.use(errorHandler)

const PORT = process.env.PORT || 3000;
const URL_RENDER = process.env.NEXT_PUBLIC_API_URL;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}/`);
    console.log(`Server is running on port ${URL_RENDER}`);
});
