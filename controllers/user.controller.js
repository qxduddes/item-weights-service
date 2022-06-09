const req = require("express/lib/request");
const USER = require('../models/user.model');

exports.allAccess = (req, res) => {
    res.status(200).send({ message: 'Public Content' });
}

exports.userBoard = (req, res) => {
    USER.find({}, (err, user) => {
        if (err) {
            return res.status(500).send({ message: err });
        }

        res.status(200).send({
            success: true,
            status: 200,
            data: user
        });
    });
}

exports.adminBoard = (req, res) => {
    res.status(200).send({ message: 'Admin Dashboard' });
}