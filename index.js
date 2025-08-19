// ===== SERVIDOR - CORS CORRIGIDO PARA HTML PURO =====

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
const { testConnection } = require('./database/db');

const app = express();

// ✅ CORS LIBERADO PARA DESENVOLVIMENTO LOCAL
const corsOptions = {
    origin: function (origin, callback) {
        // Lista de origins permitidas
        const allowedOrigins = [
            'http://localhost:3000',
            'http://127.0.0.1:5500',    // ✅ Live Server
            'http://localhost:5500',    // ✅ Live Server alternativo
            'http://127.0.0.1:3000',    // ✅ Local dev
            'null',                     // ✅ File:// protocol
            undefined                   // ✅ Sem origin (Postman, etc)
        ];
        
        // ✅ Em desenvolvimento, aceita QUALQUER origin
        if (process.env.NODE_ENV !== 'production') {
            console.log('🔓 CORS: Permitindo origin:', origin);
            return callback(null, true);
        }
        
        // Em produção, só origins específicas
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('❌ CORS bloqueado:', origin);
            callback(new Error('Não permitido pelo CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Origin',
        'X-Requested-With', 
        'Content-Type', 
        'Accept',
        'Authorization',
        'Cookie',
        'Set-Cookie'
    ],
    exposedHeaders: ['Set-Cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// ✅ MIDDLEWARE para logs detalhados
app.use((req, res, next) => {
    console.log(`📡 ${req.method} ${req.path} - Origin: ${req.get('Origin')}`);
    next();
});

// Configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/'));
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ Configuração de sessão corrigida
app.use(cookieSession({
    name: 'session',
    keys: [process.env.SESSION_SECRET || 'fallback-secret'],
    maxAge: 24 * 60 * 60 * 1000,
    secure: false, // ✅ FALSE para desenvolvimento
    httpOnly: false, // ✅ FALSE para JS puro acessar
    sameSite: 'lax' // ✅ LAX para desenvolvimento
}));

app.use(messageHandler);
app.use(logger);

// ✅ Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        cors: 'enabled'
    });
});

// ✅ Teste de CORS específico
app.get('/test-cors', (req, res) => {
    res.json({
        message: 'CORS funcionando!',
        origin: req.get('Origin'),
        headers: req.headers,
        timestamp: new Date().toISOString()
    });
});

// Rotas
app.use(router);

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: err.message 
    });
});

app.use(errorController.notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
    console.log(`🌐 Local: http://localhost:${PORT}`);
    console.log(`🔓 CORS liberado para desenvolvimento`);
});

// ===== VARIÁVEIS DE AMBIENTE PARA RENDER =====

/*
Adicione no painel do Render:

NODE_ENV=development
DATABASE_URL=sua_string_do_railway
JWT_SECRET=seu_jwt_secret
SESSION_SECRET=seu_session_secret
FRONTEND_URL=http://127.0.0.1:5500
*/