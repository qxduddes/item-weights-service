const { AUTHJWT } = require('../middlewares');
const CONTROLLER = require('../controllers/itemWeights.controller');

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
    app.post('/api/item-weights', CONTROLLER.store);
    // Update item-weights
    app.put('/api/item-weights/:id', CONTROLLER.update);
    // Get all item-weights
    app.get('/api/item-weights', CONTROLLER.get);
    // Get By Id
    app.get('/api/item-weights/:id', CONTROLLER.getById);

}