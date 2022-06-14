## Shipping Item Weights Service
This application is built with Nodejs/Express, MongoDB and JWTAuth

Requirements:
- node v17.0.1
- npm v8.1.0
- bcryptjs v2.4.3
- cognito-express v3.0.1
- cors v2.8.5
- express v4.18.1
- jsonwebtoken v8.5.1
- mongoose v6.3.4
- mongoose-paginate-v2 v1.6.3

Database
- mongodb 5.0.2

## Installation
```
npm install 
npm run start
```

## Environment Variables
```
# MongoDB Connection
MONGODB_HOST=mongodb
MONGODB_USER=root
MONGODB_PASSWORD=root
MONGODB_DATABASE=item_weights_db
MONGODB_LOCAL_PORT=7017
MONGODB_DOCKER_PORT=27017

# Live MongoDB Connection
MONGODB_URI=
MONGODB_ENV=local

NODE_LOCAL_PORT=6868
NODE_DOCKER_PORT=8080

NODE_CORS=

# Aws Cognito Authentication
AWS_DEFAULT_REGION=
COGNITO_USER_POOL_ID=
COGNITO_ENABLED=false

# Pagination
PAGE_LIMIT=2
```

## Middleware
All route access are being verified via middleware to validate if user has a valid access token from JWT or Cognito authentication during api access.
```
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
```

## Usage

**Store New Item Weights**
```
POST /api/item-weights
```
**Update Item Weights**
```
PUT /api/item-weights
```
**Get Item Weights**
```
GET /api/item-weights
```