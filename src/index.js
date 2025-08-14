const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const path = require('path');
const router = require('./routes');
const messageHandler = require('./middlewares/messageHandler');
const logger = require('./middlewares/logger');
const errorController = require('./controllers/errorController');
const errorHandler = require('./middlewares/errorHandler');
// instanciando o servidor
const app = express();
// configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))
// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/script', express.static(path.join(__dirname, 'public/script')));
// ✅ COOKIE SESSION (ainda melhor):
const cookieSession = require('cookie-session');

const vercelFrontEndUrl = "https://todo-list-2cfs.onrender.com";
const corsOptions = {
    origin: [vercelFrontEndUrl, 'http://localhost:3000'],
    Credential: true,
}
app.use(cors(corsOptions));

app.use(cookieSession({
    name: 'session',
    keys: [process.env.SESSION_SECRET],
    maxAge: 1000 * 60 * 60 * 24
}));
app.use(messageHandler);
app.use(logger);
// rotas principais
app.use(router);
// tratamento de erros
app.use(errorController.notFound);
app.use(errorHandler)
// servidor


const PORT = process.env.PORT && 3000 || process.env.RENDER_PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}/`);
});
