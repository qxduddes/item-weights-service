const mongoose = require("mongoose");
const ROLE = mongoose.model(
    "Role",
    new mongoose.Schema({
        name: String
    })
);

module.exports = ROLE;    