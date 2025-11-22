console.log("🚀 App iniciando no Render...");
require('dotenv-flow').config({ silent: true });

const express = require('express');
const cookieSession = require('cookie-session');
const path = require('path');
const router = require('./src/routes');
const messageHandler = require('./src/middlewares/messageHandler');
const logger = require('./src/middlewares/logger');
const errorController = require('./src/controllers/errorController');
const errorHandler = require('./src/middlewares/errorHandler');
const cors = require("cors");

const app = express();

// configs
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));
app.use(express.static(path.join(process.cwd(), 'public')));

// middlewares
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);

app.use(cors({
    origin: ["https://todoolists.vercel.app"],
    credentials: true
})); 

// session
app.use(cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
secure: process.env.NODE_ENV === "production" || true ,
sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    httpOnly: true,
}));

app.use(messageHandler);
app.use(logger);

// routes
app.use(router);

// errors
app.use(errorController.notFound);
app.use(errorHandler);
process.on("uncaughtException", (err) => {
  console.error("❌ Erro fatal:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Promessa rejeitada sem catch:", err);
});

// exportar p/ vercel funcionar
module.exports = app;
