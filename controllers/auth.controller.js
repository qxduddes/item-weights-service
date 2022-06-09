const CONFIG = require('../config/auth.config');
const DB = require('../models');

const USER = DB.USER;
const ROLE = DB.ROLE;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

// User Signup
exports.signup = (req, res) => {
    const user = new USER({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });

    user.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (req.body.roles) {
            ROLE.find({
                name: { $in: res.body.roles }
            }, (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                user.roles = roles.map(role => role._id);

                user.save( err => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    res.send({ 
                        success: true,
                        status: 200,
                        message: 'User created',
                        data: user
                     });
                });

            });
        } else {

            ROLE.findOne({ name: 'user' }, (err, role) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                user.roles = [role._id];

                user.save( err => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    res.send({ 
                        success: true,
                        status: 200,
                        message: 'User created',
                        data: user
                     });
                })

            });
        }  
    });
}

// User Sign-in
exports.signin = (req, res) => {
    USER.findOne({ email: req.body.email })
        .populate('roles', '-__v')
        .exec((err, user) => {
            if (err) {
                return res.status(500).send({ message: err});
            }

            if(!user) {
                return res.status(404).send({ message: 'User Not Found' });
            }

            let validPassword = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!validPassword) {
                return res.status(401).send({ accessToken: null, message: 'Invalid Password' });
            }

            let token = jwt.sign({ id: user.id }, CONFIG.secret, {
               expiresIn: 86400 // 24hrs 
            });

            let authorities = [];

            for(let i = 0; i < user.roles.length; i++) {
                authorities.push('role_' + user.roles[i].name.toUpperCase());
            }

            res.status(200).send({
               id: user.id,
               username: user.username,
               email: user.email,
               roles: authorities,
               accessToken: token 
            });
        });
}