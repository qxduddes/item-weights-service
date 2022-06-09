const req = require("express/lib/request");
const ITEM_WEIGHTS = require('../models/itemWeights.model');

exports.store = (req, res) => {
    const weight = new ITEM_WEIGHTS(req.body);

    weight.save((err, weights) => {
        if (err) {
            return res.status(400).send({ 
                success: false, 
                status: 400, 
                message: err 
            });
        }

        return res.status(201).send({
            success: true,
            status: 201,
            data: weights
        });
    });
};

exports.update = (req, res) => {
    const filter = {
        _id: req.body.id
    };

    ITEM_WEIGHTS.findOneAndUpdate(filter, req.body, { new: true }, (error, weight) => {
        if (error) {
            return res.status(400).send({ 
                success: false, 
                status: 400, 
                message: error 
            });
        }

        return res.status(200).send({
            success: true,
            status: 200,
            data: weight
        });
    });
};

exports.get = (req, res) => {
    let currentPage = 1;
    const pageLimit = process.env.PAGE_LIMIT;
    
    if (req.query.page && req.query.page > 1) {
        currentPage = req.query.page;
    }

    let aggregateQuery = ITEM_WEIGHTS.aggregate();

    if (req.query.material_id && req.query.material_id > 0) {
        console.log('material id: '+ req.query.material_id);
        aggregateQuery = ITEM_WEIGHTS.aggregate([{ $match: { material_id: parseInt(req.query.material_id) } }]);
    }

    if (req.query.user_id && req.query.user_id > 0) {
        console.log('user id: '+ req.query.user_id);
        aggregateQuery = ITEM_WEIGHTS.aggregate([{ $match: { user_id: parseInt(req.query.user_id) } }]);
    }

    if (req.query.brand && req.query.brand !== null) {
        console.log('brand: '+ req.query.brand);
        aggregateQuery = ITEM_WEIGHTS.aggregate([{ $match: { brand: parseInt(req.query.brand) } }]);
    }

    if (req.query.order_id && req.query.order_id > 0) {
        console.log('order id: '+ req.query.order_number);
        aggregateQuery = ITEM_WEIGHTS.aggregate([{ $match: { order_number: parseInt(req.query.order_number) } }]);
    }
    
    ITEM_WEIGHTS.aggregatePaginate(aggregateQuery, { page: currentPage, limit: pageLimit }, (err, result) => {
        if (err) {
            return res.status(400).send({
                success: false,
                status: 400,
                message: err
            });
        }

        return res.status(200).send({
            success: true,
            status: 200,
            data: result
        });
    });
};

exports.getById = (req, res) => {
    console.log('_id: ' + req.query.material_id);
    ITEM_WEIGHTS.find({ _id: req.params.id}, (error, weights) => {
        if (error) {
            return res.status(400).send({ 
                success: false, 
                status: 400, 
                message: error 
            });
        }

        return res.status(200).send({
            success: true,
            status: 200,
            data: weights
        });
    });
};

