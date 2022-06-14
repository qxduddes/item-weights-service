require('dotenv').config();
const logger = require('../utils/logger');
const req = require("express/lib/request");
const ITEM_WEIGHTS = require('../models/itemWeights.model');

exports.store = (req, res) => {
    const weight = new ITEM_WEIGHTS(req.body);

    weight.save((err, weights) => {
        if (err) {
            logger.error(`Error: ${req.ip} - ${req.method}/${req.status || 400} ${req.originalUrl} - ${err.message}`);
            return res.status(400).send({ 
                success: false, 
                status: 400, 
                message: err.message 
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

    ITEM_WEIGHTS.findOneAndUpdate(filter, req.body, { new: true }, (err, weight) => {
        if (err) {
            logger.error(`Error: ${req.ip} - ${req.method}/${req.status || 400} ${req.originalUrl} - ${err.message}`);
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

    const customLabels = {
        docs: 'data',
        totalDocs: 'total',
        limit: 'per_page',
        page: 'current_page',
        nextPage: 'next',
        prevPage: 'prev',
        totalPages: 'page_count',
        hasPrevPage: 'has_prev',
        hasNextPage: 'has_next',
        pagingCounter: 'page_counter',
        meta: 'paginator'
    };

    const options = {
        page: currentPage,
        limit: pageLimit,
        customLabels: customLabels
    };

    
    let aggregateQuery = ITEM_WEIGHTS.aggregate();

    if (req.query.factory && req.query.factory.length > 0) {
        console.log('Filter By Factory: '+ req.query.factory);
        aggregateQuery = ITEM_WEIGHTS.aggregate([{ $match: { factory: req.query.factory } }]);
    }

    if (req.query.brand && req.query.brand.length > 0) {
        console.log('Filter By Brand: '+ req.query.brand);
        aggregateQuery = ITEM_WEIGHTS.aggregate([{ $match: { brand: req.query.brand } }]);
    }

    if (req.query.sport && req.query.sport.length > 0) {
        console.log('Filter By Sport: '+ req.query.sport);
        aggregateQuery = ITEM_WEIGHTS.aggregate([{ $match: { sport:req.query.sport } }]);
    }

    if (req.query.fabric && req.query.fabric.length > 0) {
        console.log('Filter By fabric: '+ req.query.fabric);
        aggregateQuery = ITEM_WEIGHTS.aggregate([{ $match: { fabric: req.query.fabric } }]);
    }

    if (req.query.item && req.query.item.length > 0) {
        console.log('Filter By Item: '+ req.query.item);
        aggregateQuery = ITEM_WEIGHTS.aggregate([{ $match: { item: req.query.item } }]);
    }

    if (req.query.order_number && req.query.order_number.length > 0) {
        console.log('Filter By Order Number: '+ req.query.order_number);
        aggregateQuery = ITEM_WEIGHTS.aggregate([{ $match: { order_number: req.query.order_number } }]);
    }

    if (req.query.part_id_number && req.query.part_id_number.length > 0) {
        console.log('Filter By part_id_number: '+ req.query.part_id_number);
        aggregateQuery = ITEM_WEIGHTS.aggregate([{ $match: { part_id_number: req.query.part_id_number } }]);
    }

    // TODO: Find a way to search data inside object
    if (req.query.size && req.query.size.length > 0) {
        console.log('Filter By sizes: '+ req.query.size);
        aggregateQuery = ITEM_WEIGHTS.aggregate([{ $match: { 'weights.size': req.query.size } }]);
    }
    
    ITEM_WEIGHTS.aggregatePaginate(aggregateQuery, options, (err, result) => {
        if (err) {
            logger.error(`Error: ${req.ip} - ${req.method}/${req.status || 400} ${req.originalUrl} - ${err.message}`);
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
    logger.info('_id: ' + req.params.id);
    ITEM_WEIGHTS.find({ _id: req.params.id}, (err, weights) => {
        if (err) {
            logger.error(`Error: ${req.ip} - ${req.method}/${req.status || 400} ${req.originalUrl} - ${err.message}`);
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

