const db = require('../models');
const ROLES = db.ROLES;

const User = db.users;

const checkDuplicateUsernameOrEmail = (req, res, next) => {

    // username
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then((user) => {
        if (user) {
            res.status(400).send({
                message: "Failed! Username is already taken!"
            })
            return;
        }

        // email
        User.findOne({
            where: {
                email: req.body.email
            }
        }).then((user) => {
            if (user) {
                res.status(400).send({
                    message: "Failed! Email is already taken!"
                })
                return;
            }

            next();
        })
    })
}

const checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: `Failed! Role ${req.body.roles[i]} does not exist!`
                })
                return;
            }
        }
    }

    next();
}

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted
}

module.exports = verifySignUp;