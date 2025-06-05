const express = require('express');
const path = require('path');
const router = require('./router');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 


app.use(router)

app.use((req, res) => {
    res.status(404).render('errors/404', {
        title: 'Página não encontrada',
        message: `A página ${req.originalUrl} não foi encontrada`
    });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('errors/500', {
        title: 'Erro interno do servidor',
        message: 'Ocorreu um erro interno do servidor. Por favor, tente novamente. Se o problema persistir, entre em contato com o suporte.(Abre um chamado :))'
    });
})


const PORT = 3000;
app.listen(PORT, () =>  {console.log(`Servidor http://localhost:${PORT}`)})


module.exports = app;

