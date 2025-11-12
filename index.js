require('dotenv-flow').config();
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const path = require('path');
const router = require('./src/routes');
const messageHandler = require('./src/middlewares/messageHandler');
const logger = require('./src/middlewares/logger');
const errorController = require('./src/controllers/errorController');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

// Configurações
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Importante para API

// Trust proxy (necessário para HTTPS no Render)
app.set('trust proxy', 1);

// ===== CONFIGURAÇÃO DE SESSÃO COM SUPABASE =====
app.use(session({
    store: new pgSession({
        conString: process.env.DATABASE_URL,
        tableName: 'user_sessions',
        createTableIfMissing: true // Cria a tabela automaticamente
    }),
    secret: process.env.SESSION_SECRET || 'seu-secret-aqui-mude-isso',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        secure: process.env.NODE_ENV === 'production', // true em produção (HTTPS)
        httpOnly: true,
        sameSite: 'lax' // Mudei de 'none' para 'lax'
    }
}));

app.use(messageHandler);
app.use(logger);

// Rotas
app.use(router);

// Tratamento de erros
app.use(errorController.notFound);
app.use(errorHandler);

// Error handler global
app.use((err, req, res, next) => {
    console.error('❌ Erro:', err);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Server running on 0.0.0.0:${port}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔐 Session store: PostgreSQL (Supabase)`);
});