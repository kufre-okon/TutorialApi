const db = require('../models');
const config = require('../config/auth.config');
const User = db.users;
const Role = db.roles;

const Op = db.Sequelize.Op;

var jwt = require('jsonwebtoken'),
    bcrypt = require('bcryptjs');

module.exports = {
    signup: (req, res) => {
        // save user to database
        User.create({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 8),
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            isActive: true
        }).then((user) => {
            if (req.body.roles) {
                Role.findAll({
                    where: {
                        name: {
                            [Op.or]: req.body.roles
                        }
                    }
                }).then((roles) => {
                    user.setRoles(roles).then(() => {
                        res.send({ message: 'User was registered succesfully!' });
                    })
                })
            } else {
                // user role = 1
                user.setRoles([1]).then(() => {
                    res.send({ message: 'User was registered succesfully!' });
                })
            }
        }).catch((err) => {
            res.status(500).send({
                message: err.message
            })
        })
    },
    signin: (req, res) => {
        User.findOne({
            where: {
                username: req.body.username
            }
        }).then((user) => {
            if (!user) {
                return res.status(401).send({
                    message: 'Invalid username or password',
                    accessToken: null
                });
            }
            const isValidPassword = bcrypt.compareSync(req.body.password, user.password);
            if (!isValidPassword) {
                return res.status(401).send({
                    message: 'Invalid username or password',
                    accessToken: null
                })
            }

            let token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            let authorities = [];
            user.getRoles().then((roles) => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push(roles[i].name.toUpperCase());
                }
                res.status(200).send({
                    id: user.id,
                    username: user.username,
                    fullname: user.firstName + " " + user.lastName,
                    email: user.email,
                    roles: authorities,
                    accessToken: token
                })
            })
        }).catch((err) => {
            res.status(500).send({ message: err.message });
        })
    }
}