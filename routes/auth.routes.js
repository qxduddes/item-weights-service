const { VERIFYSIGNUP } = require('../middlewares');
const CONTROLLER = require('../controllers/auth.controller');

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept",
            "Authorization"
        );
        next();
    });

    app.post('/api/auth/signup', [
        VERIFYSIGNUP.checkDuplicate,
        VERIFYSIGNUP.checkHasRole
    ],
    CONTROLLER.signup);

    app.post('/api/auth/signin', CONTROLLER.signin);
}