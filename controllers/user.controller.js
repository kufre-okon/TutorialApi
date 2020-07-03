const db = require('../models');
const User = db.users;
const Op = db.Sequelize.Op;
const bcrypt = require('bcryptjs');

module.exports = {
    /**
     * Get all users
     */
    list: (req, res) => {
        let name = req.query.name,
            condition = name ? {
                [Op.or]: [
                    { firstName: { [Op.like]: `%${name}%` } },
                    { lastName: { [Op.like]: `%${name}%` } }
                ]
            } : null;
        // select * from users where firstName like %{name}% or lastName like %{name}%
        User.findAll({ where: condition }).then(data => {
            let users = data.map(u => ({
                id: u.id,
                firstName: u.firstName,
                lastName: u.lastName,
                username: u.username,
                email: u.email,
                isActive: u.isActive,
                createdAt: u.createdAt,
                updatedAt: u.updatedAt
            }));
            res.send(users);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while fetching users'
            });
        });
    },
    /**
     * Get user by Id
     */
    findOne: (req, res) => {
        const id = req.params.id;

        User.findByPk(id).then(data => {
           
            let user = {
                id: data.id,
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                email: data.email,
                isActive: data.isActive,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                roles: []
            };
            data.getRoles().then((roles) => {
                let authorities = [];
                for (let i = 0; i < roles.length; i++) {
                    authorities.push(roles[i].name.toUpperCase());
                }
                user.roles = authorities;
                res.send(user);
            }).catch(err => {
                console.log(err);
                res.send(user)
            })
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving user with id=' + id
            });
        })
    },
    /**
     * Update user by Id
     */
    update: (req, res) => {
        const id = req.params.id;
        const body = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            isActive: req.body.isActive
        }
        User.update(body, {
            where: { id: id }
        }).then(num => {
            if (num == 1) {
                res.send({ message: "User was updated successfully." });
            } else {
                res.send({
                    message: `Cannot update user with id=${id}.Maybe user was not found or req.body is empty!`
                });
            }
        }).catch(err => {
            res.status(500).send({
                message: "Error updating Comment with id=" + id
            });
        })
    },
    /**
     * Change user password     
     */
    changePassword: (req, res) => {
        const id = req.body.id,
            oldPassword = req.body.oldPassword,
            newPassword = req.body.newPassword;

        User.findByPk(id).then(user => {
            let isValidOldPassword = bcrypt.compareSync(oldPassword, user.password);
            if (!isValidOldPassword) {
                return res.status(400).send({
                    message: 'Invalid password'
                });
            }
            User.update({ password: bcrypt.hashSync(newPassword, 8) }, {
                where: { id: id }
            }).then(num => {
                if (num == 1) {
                    res.send({ message: "User password was changed successfully." });
                } else {
                    res.send({
                        message: 'Cannot change user password!'
                    });
                }
            }).catch(err => {
                res.status(500).send({
                    message: "Error changing user password"
                });
            })
        }).catch(err => {
            return res.status(500).send({
                message: err.message || 'Some error occurred while retrieving user with id=' + id
            });
        })
    },
    updateStatus: (req, res) => {
        const id = req.body.id,
            status = req.body.status || false;

        User.update({ isActive: status }, {
            where: { id: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: `User was ${(status ? 'disabled' : 'enabled')} successfully!`
                });
            }
        }).catch(err => {
            res.status(500).send({
                message: `Could not ${(status ? 'disabled' : 'enabled')} User with id=${id}`
            });
        });
    }
}