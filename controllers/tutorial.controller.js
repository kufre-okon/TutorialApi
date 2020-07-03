const db = require('../models');
const paginator = require('../helpers/pagination.helper.js');
const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;


module.exports = {
    create: (req, res) => {
        if (!req.body.title) {
            res.status(400).send({
                message: 'Tutorial Title cannot be empty'
            });
            return;
        }

        // create a tutorial
        const _tutorial = {
            title: req.body.title,
            description: req.body.description,
            published: req.body.published ? req.body.published : false
        }

        // save tutorial in the database
        Tutorial.create(_tutorial).then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while creating tutorial'
            });
        });
    },
    findAll: (req, res) => {
        const title = req.query.title,
            condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

        const { limit, offset, page } = paginator.getPagination(req.query.page, req.query.pageSize);

        Tutorial.findAndCountAll({ where: condition, limit, offset }).then(data => {
            const response = paginator.getPagingData(data, page, limit);
            res.send(response);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving tutorials'
            });
        })
    },
    findOne: (req, res) => {
        const id = req.params.id;

        Tutorial.findByPk(id).then(data => {
            res.send(data)
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving tutorial with id=' + id
            });
        })
    },
    update: (req, res) => {
        const id = req.params.id;
        Tutorial.update(req.body, {
            where: { id: id }
        }).then(num => {
            if (num == 1) {
                res.send({ message: "Tutorial was updated successfully." });
            } else {
                res.send({
                    message: `Cannot update tutorial with id=${id}.Maybe tutorial was not found or req.body is empty!`
                });
            }
        }).catch(err => {
            res.status(500).send({
                message: "Error updating Tutorial with id=" + id
            });
        })
    },
    delete: (req, res) => {
        const id = req.params.id;

        Tutorial.destroy({
            where: { id: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "Tutorial was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
                });
            }
        }).catch(err => {
            res.status(500).send({
                message: "Could not delete Tutorial with id=" + id
            });
        });
    },
    deleteAll: (req, res) => {
        Tutorial.destroy({
            where: {},
            truncate: false
        }).then(nums => {
            res.send({ message: `${nums} Tutorials were deleted successfully!` });
        }).catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
    },
    findAllPublished: (req, res) => {

        const { limit, offset, page } = paginator.getPagination(req.query.page, req.query.pageSize);

        Tutorial.findAndCountAll({ where: { published: true }, limit, offset }).then(data => {
            const response = paginator.getPagingData(data, page, limit);
            res.send(response);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            })
        })
    }
}