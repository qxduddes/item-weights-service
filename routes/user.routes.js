const { AUTHJWT } = require('../middlewares');
const CONTROLLER = require('../controllers/user.controller');

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept',
            'Authorization'
        );
        next();
    });

    app.get('/api/test/all', CONTROLLER.allAccess);
    app.get('/api/test/user', [AUTHJWT.verifyToken], CONTROLLER.userBoard);
    app.get('/api/test/admin', [AUTHJWT.verifyToken, AUTHJWT.isAdmin], CONTROLLER.adminBoard);
};
