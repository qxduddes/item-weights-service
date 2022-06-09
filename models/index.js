const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.USER = require("./user.model");
db.ROLE = require("./role.model");
db.WEIGHTS = require("./itemWeights.model");
db.ROLES = ["user", "admin"];

module.exports = db;
