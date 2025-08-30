const express = require('express');
const authController = require('../../controllers/authController');
const errorController = require('../../controllers/errorController');
const router = express.Router();

router.get('/login', authController.loginPage);
router.post('/login', authController.login);
router.get('/register', authController.registerPage);
 router.post('/register', authController.register);
 router.use('/logout', (req, res, next) => {
    console.log(`🚪 ROTA LOGOUT CHAMADA!`);
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${req.url}`);
    console.log(`Session antes do logout:`, req.session);
    next();
});
router.post('/logout', authController.logout);
router.post('/delete', authController.deleteAccount);

// lidar com erros de autorização
router.get('/erro401', errorController.unauthorized)
router.get('/erro404', errorController.notFound)
router.get('/erro500', errorController.internalServerError)

// rotas de senha

router.get('/forgetPassword', authController.forgetPasswordGET);
router.post('/forgetPassword', authController.forgetPasswordPOST);

router.get('/resetPassword', authController.resetPasswordGET);
router.post('/resetPassword', authController.resetPasswordPOST);


module.exports = router;