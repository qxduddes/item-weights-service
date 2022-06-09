const mongoose = require('mongoose');
const Pagination = require('mongoose-aggregate-paginate-v2');
const uniqueValidator = require('mongoose-unique-validator');

const ITEM_WEIGHTS_SCHEMA = new mongoose.Schema({
    order_number: { 
        type: String,
        index: true,
        required: true
    },
    part_id_number: { 
        type: Number,
        index: true,
        required: true,
        unique: true
    },
    material_id: { 
        type: Number,
        index: true,
        required: true
    },
    brand: String,
    factory: {
        type: String,
        index: true,
        required: true
    },
    sport: String,
    item_name: String,
    brand_fabric: String,
    weights: {
        type: String,
        required: true,
        get: (data) => {
            try {
                return JSON.parse(data);
            } catch(error) {
                return data;
            }
        },
        set: (data) => {
            return data;
        }
    },
}, { timestamps: true, collection: 'weights' }, );

ITEM_WEIGHTS_SCHEMA.plugin(Pagination);
ITEM_WEIGHTS_SCHEMA.plugin(uniqueValidator, { 
    success: false, 
    message: 'Data already exist' 
});

const ITEM_WEIGHTS = mongoose.model(
    "ItemWeights",
    ITEM_WEIGHTS_SCHEMA
);

module.exports = ITEM_WEIGHTS;