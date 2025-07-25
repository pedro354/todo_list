function errorHandler(err, req, res, next) {
    const date = new Date().toLocaleString();
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500
    const thisApi = req.originalUrl.startsWith('/router/api')
    if(thisApi){
        res.status(statusCode).json({
            title: statusCode === 400 ? 'Bad Request' :
                   statusCode === 404 ? 'Not Found' :
                    statusCode === 401 ? 'Unauthorized' :
                   'Internal Server Error',
            message: err.message || "O estagiário tropeçou no servidor... foi mal 😅",
            error: err,
            date
        })
        } else {
        const viewError  = statusCode === 400 ? 'errors/400' :
        statusCode === 401 ? 'errors/401' :
                          statusCode === 404 ? 'errors/404' :
                          'errors/500'
        res.status(statusCode).render(viewError, {
            title: `${statusCode} - Erro!`,
            message: err.message || "O estagiário tropeçou no servidor... foi mal 😅",
            error: err,
            date
        })
    }
}
export default errorHandler

