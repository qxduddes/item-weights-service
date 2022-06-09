const JWT = require('jsonwebtoken');
const CONFIG = require('../config/auth.config');
const DB = require('../models');
const CognitoExpress = require('cognito-express');

const USER = DB.USER;
const ROLE = DB.ROLE;

const cognitoExpress = new CognitoExpress({
    region: process.env.AWS_DEFAULT_REGION,
    cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
    tokenUse: "access",
    tokenExpiration: 3600
});

verifyToken = (req, res, next) => {
    let authorizationBearer = req.headers.authorization;
    let token = authorizationBearer.split(' ')[1];
    const cognitoEnabled = process.env.COGNITO_ENABLED;

    if (!token) {
        return res.status(403).send({
            success: false,
            error: "Unauthorized",
            message: "Invalid access token"
        });
    }

    if (cognitoEnabled === "true") {
        cognitoExpress.validate(token, (error, response) => {
            if (error) {
                return res.status(403).send({
                    success: false,
                    error: "Unauthorized",
                    message: "Invalid access token"
                });
            }

            next();
        });

    } else {
        JWT.verify(token, CONFIG.secret, (err, decoded) => {
            if (err) {
                return res.status(401).send({ 
                    success: false,
                    error: 'Unauthorized',
                    message: err });
            }
    
            req.userId = decoded.id;
            next();
        });
    }

};

isAdmin = (req, res, next) => {
    USER.findById(req.userId).exec((err, user) => {
        if (err) {
            console.log('error: '+ err);
            return res.status(500).send({ message: err });
        }

        ROLE.find({
            _id: { $in: user.roles }
        }, (err, roles) => {
            if(err) {
                return res.status(500).send({ message: err });
            }

            for(let i = 0; i < roles.length; i++) {
                if (roles[i].name === 'admin') {
                    next();
                    return;
                }
            }

            return res.status(403).send({ message: 'Admin role is required'});
        });
    });
};

const authJwt = {
    verifyToken, isAdmin
};

module.exports = authJwt;