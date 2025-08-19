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
    origin:  function (origin, callback) {
        const allowdOrigins = [
            'http://localhost:3000',
            'https://todo-list-puce-eight-85.vercel.app/',
            process.env.FRONTEND_URL
        ];
        if (allowdOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Cookie']
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

app.get('/api/test-db', async (req, res) => {
    try {
        const isConnected = await testConnection();
        res.status(200).json({ 
            database: isConnected ? 'Connected' : 'Disconnected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Database test failed', 
            message: error.message 
        });
    }
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

const PORT = process.env.PORT;
const URL_RENDER = process.env.NEXT_PUBLIC_API_URL;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}/`);
    console.log(`Server is running on port ${URL_RENDER}`);
});
