// ===== SERVIDOR (RENDER) - CORS PARA VERCEL =====

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

// ✅ CORS CONFIGURADO ESPECIFICAMENTE PARA VERCEL
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            // ✅ Substitua pela sua URL do Vercel
            'https://seu-todo-app.vercel.app',
            'https://todo-list-puce-eight-85.vercel.app', // ✅ Sua URL atual
            
            // ✅ Outros domínios Vercel (caso tenha preview)
            /https:\/\/.*\.vercel\.app$/,
            
            // ✅ Domínio customizado (se tiver)
            process.env.FRONTEND_URL,
            
            // ✅ Para desenvolvimento local (caso teste)
            'http://localhost:3000',
            'http://127.0.0.1:5500'
        ];
        
        console.log('🔍 CORS Origin:', origin);
        
        // ✅ Sem origin (requests diretos/Postman)
        if (!origin) {
            console.log('✅ CORS: Permitindo request sem origin');
            return callback(null, true);
        }
        
        // ✅ Verifica origins permitidas
        const isAllowed = allowedOrigins.some(allowedOrigin => {
            if (typeof allowedOrigin === 'string') {
                return origin === allowedOrigin;
            } else if (allowedOrigin instanceof RegExp) {
                return allowedOrigin.test(origin);
            }
            return false;
        });
        
        if (isAllowed) {
            console.log('✅ CORS: Origin permitida');
            callback(null, true);
        } else {
            console.log('❌ CORS: Origin bloqueada:', origin);
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
        'Set-Cookie',
        'Access-Control-Allow-Credentials'
    ],
    exposedHeaders: ['Set-Cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// ✅ Middleware para logs detalhados
app.use((req, res, next) => {
    console.log(`📡 ${req.method} ${req.path}`);
    console.log(`🌍 Origin: ${req.get('Origin')}`);
    console.log(`🔑 User-Agent: ${req.get('User-Agent')?.substring(0, 50)}...`);
    next();
});

// Configurações básicas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/'));
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ Configuração de sessão para produção (Vercel + Render)
app.use(cookieSession({
    name: 'session',
    keys: [process.env.SESSION_SECRET || 'fallback-secret'],
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    secure: true, // ✅ TRUE para HTTPS (Vercel/Render)
    httpOnly: false, // ✅ FALSE para JS acessar
    sameSite: 'none' // ✅ NONE para cross-origin (Vercel→Render)
}));

app.use(messageHandler);
app.use(logger);

// ✅ Health check melhorado
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        cors: 'enabled for Vercel',
        origin: req.get('Origin')
    });
});

// ✅ Teste específico para Vercel
app.get('/test-vercel', (req, res) => {
    const origin = req.get('Origin');
    const isVercel = origin && origin.includes('vercel.app');
    
    res.json({
        message: 'Teste Vercel + Render',
        origin: origin,
        isVercelOrigin: isVercel,
        corsWorking: true,
        timestamp: new Date().toISOString(),
        headers: {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Credentials': 'true'
        }
    });
});

// Rotas principais
app.use(router);

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.message);
    
    // ✅ Erro específico de CORS
    if (err.message.includes('CORS')) {
        return res.status(403).json({
            error: 'CORS Error',
            message: 'Origin não permitida',
            allowedOrigins: ['vercel.app domains']
        });
    }
    
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
    });
});

app.use(errorController.notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
    console.log(`🌐 Render URL: https://todo-list-2cfs.onrender.com`);
    console.log(`🔗 Configurado para Vercel: *.vercel.app`);
    console.log(`🍪 Cookies: secure=true, sameSite=none`);
});

// ===== VARIÁVEIS PARA RENDER =====
/*
NODE_ENV=production
DATABASE_URL=sua_string_railway
SESSION_SECRET=seu_secret
FRONTEND_URL=https://todo-list-puce-eight-85.vercel.app
*/