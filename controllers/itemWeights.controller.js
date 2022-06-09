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

    if (req.query.factory && req.query.factory.length > 0) {
        console.log('Filter By Factory: '+ req.query.factory);
        aggregateQuery = ITEM_WEIGHTS.aggregate([{ $match: { factory: parseInt(req.query.factory) } }]);
    }

    if (req.query.brand && req.query.brand.length > 0) {
        console.log('Filter By Brand: '+ req.query.brand);
        aggregateQuery = ITEM_WEIGHTS.aggregate([{ $match: { brand: parseInt(req.query.brand) } }]);
    }

    if (req.query.sport && req.query.sport.length > 0) {
        console.log('Filter By Sport: '+ req.query.sport);
        aggregateQuery = ITEM_WEIGHTS.aggregate([{ $match: { sport: parseInt(req.query.sport) } }]);
    }

    if (req.query.fabric && req.query.fabric.length > 0) {
        console.log('Filter By fabric: '+ req.query.fabric);
        aggregateQuery = ITEM_WEIGHTS.aggregate([{ $match: { fabric: parseInt(req.query.fabric) } }]);
    }

    if (req.query.item && req.query.item.length > 0) {
        console.log('Filter By Item: '+ req.query.item);
        aggregateQuery = ITEM_WEIGHTS.aggregate([{ $match: { item: parseInt(req.query.item) } }]);
    }

    if (req.query.order_number && req.query.order_number.length > 0) {
        console.log('Filter By Order Number: '+ req.query.order_number);
        aggregateQuery = ITEM_WEIGHTS.aggregate([{ $match: { order_number: parseInt(req.query.order_number) } }]);
    }

    if (req.query.part_id_number && req.query.part_id_number.length > 0) {
        console.log('Filter By part_id_number: '+ req.query.part_id_number);
        aggregateQuery = ITEM_WEIGHTS.aggregate([{ $match: { part_id_number: parseInt(req.query.part_id_number) } }]);
    }

    // TODO: Find a way to search data inside object
    // if (req.query.sizes && req.query.sizes.length > 0) {
    //     console.log('Filter By sizes: '+ req.query.sizes);
    //     aggregateQuery = ITEM_WEIGHTS.aggregate([{ $match: { weights.sizes: parseInt(req.query.sizes) } }]);
    // }
    
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

