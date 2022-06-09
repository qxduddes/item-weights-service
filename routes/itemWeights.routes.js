const { AUTHJWT } = require('../middlewares');
const CONTROLLER = require('../controllers/itemWeights.controller');
const AUTHJWT = require('../middlewares/authJwt');

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept',
            'Authorization'
        );
        next();
    });

    // Store new item-weights
    app.post('/api/item-weights', [AUTHJWT.verifyToken], CONTROLLER.store);
    // Update item-weights
    app.put('/api/item-weights/:id', [AUTHJWT.verifyToken], CONTROLLER.update);
    // Get all item-weights
    app.get('/api/item-weights', [AUTHJWT.verifyToken], CONTROLLER.get);
    // Get By Id
    app.get('/api/item-weights/:id', [AUTHJWT.verifyToken], CONTROLLER.getById);

}