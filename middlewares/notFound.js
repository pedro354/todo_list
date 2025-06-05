function notFound(req, res, next) {
    res.status(404)

    const thisApi = req.originalUrl.startsWith('/router/api')
    if(thisApi) {
        res.json({
            title: 'Not Found',
            message: `A rota ${req.originalUrl} que uma vez existiu não existe mais ¯\_(ツ)_/¯`,
        })
    }else{
        res.render('errors/404', { 
            title: '404 - Página Não Encontrada',
            message: `A página ${req.originalUrl} não foi encontrada!`
        });
        }
}
export default notFound