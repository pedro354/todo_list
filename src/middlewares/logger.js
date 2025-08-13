function logger(req, res, next) {
    const date = new Date().toLocaleString();
    const statusCode = res.statusCode;
    const statusEmoji = 
    statusCode >= 500 ? '🔥' :
    statusCode >= 400 ? '🚨' :
    statusCode >= 401 ? '👮' :
    statusCode >= 300 ? '🔗' :
    statusCode >= 200 ? '👍' : '🤷';
    console.log(`${statusEmoji} [${date}] ${req.method} ${req.url} ${req.ip} - Status: ${statusCode}`);
    next();
}

module.exports = logger;