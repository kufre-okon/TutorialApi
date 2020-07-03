const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models');
const User = db.users;

const verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).send({
            message: 'No token provided!'
        })
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unthorized!"
            })
        }
        req.userId = decoded.id;
        next();
    })
}

const isAdmin = (req, res, next) => {
    User.findByPk(req.userId).then((user) => {
        user.getRoles().then((roles) => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name.toLowercase() === 'admin') {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: "Required Admin Role!"
            });
            return;
        })
    })
}

const authJwt = {
    verifyToken,
    isAdmin
}

module.exports = authJwt;