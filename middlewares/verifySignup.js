const DB = require('../models');
const ROLES = DB.ROLE;
const USER = DB.USER;

checkDuplicate = (req, res, next) => {

    // Check username
    USER.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (user) {
            res.status(400).send({ message: "Username already in use" });
        }

        // Check email address
        USER.findOne({
            email: req.body.email
        }).exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (user) {
                res.status(400).send({ message: 'Email (' + user.email + ') already taken'});
                return;
            }

            next();
        });
    });
};

checkHasRole = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({ message: `Role ${re.body.roles[i]} does not exist`} );
            }
            return;
        }
    }
    next();
};

const verifySignUp = {
    checkDuplicate, checkHasRole
}

module.exports = verifySignUp;