const mongoose = require("mongoose");
const ROLE = require('../models/role.model');

const USER = mongoose.model(
    "User",
    new mongoose.Schema({
        username: String,
        email: String,
        password: String,
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: ROLE
            }
        ]
    }, { timestamps: true })
);

module.exports = USER;