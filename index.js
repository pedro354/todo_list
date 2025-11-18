if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require('express');
const cookieSession = require('cookie-session');
const path = require('path');
const router = require('./src/routes');
const messageHandler = require('./src/middlewares/messageHandler');
const logger = require('./src/middlewares/logger');
const errorController = require('./src/controllers/errorController');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

// configs
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));
app.use(express.static(path.join(process.cwd(), 'public')));

// middlewares
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);

// session
app.use(cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    secure: true,     // 🔥 obrigatório no vercel
    httpOnly: true,
    sameSite: "none"  // 🔥 obrigatório no vercel para cookie cross-site
}));

app.use(messageHandler);
app.use(logger);

// routes
app.use(router);

// errors
app.use(errorController.notFound);
app.use(errorHandler);

// exportar p/ vercel funcionar
module.exports = app;
