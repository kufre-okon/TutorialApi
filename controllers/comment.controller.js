const db = require('../models');
const Comment = db.comments;
const Op = db.Sequelize.Op;

module.exports = {
    create: (req, res) => {
        if (!req.body.name) {
            res.status(400).send({
                message: 'Name can not be empty'
            });
            return;
        }
        if (!req.body.text) {
            res.status(400).send({
                message: 'Comment text can not be empty'
            });
            return;
        }

        // save comment in the database
        Comment.create(req.body).then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while creating comment'
            });
        });
    },
    findAll: (req, res) => {        
        const name = req.body.name,
            condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

        Comment.findAll({ where: condition }).then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving comments'
            });
        })
    },
    findOne: (req, res) => {
        const id = req.params.id;

        Comment.findByPk(id).then(data => {
            res.send(data)
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving comment with id=' + id
            });
        })
    },
    update: (req, res) => {
        const id = req.params.id;
        Comment.update(req.body, {
            where: { id: id }
        }).then(num => {
            if (num == 1) {
                res.send({ message: "Comment was updated successfully." });
            } else {
                res.send({
                    message: `Cannot update comment with id=${id}.Maybe comment was not found or req.body is empty!`
                });
            }
        }).catch(err => {
            res.status(500).send({
                message: "Error updating Comment with id=" + id
            });
        })
    },
    delete: (req, res) => {
        const id = req.params.id;

        Comment.destroy({
            where: { id: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "Comment was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Comment with id=${id}. Maybe comment was not found!`
                });
            }
        }).catch(err => {
            res.status(500).send({
                message: "Could not delete Comment with id=" + id
            });
        });
    },
    deleteAll: (req, res) => {
        Comment.destroy({
            where: {},
            truncate: false
        }).then(nums => {
            res.send({ message: `${nums} Comments were deleted successfully!` });
        }).catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all comments."
            });
        });
    },
    findByTutorial: (req, res) => {              
        Comment.findAll({ where: { tutorialId: req.params.tutorialId } }).then(data => {
            res.send(data)
        }).catch(err => {
            res.status(500).send({
                message: err.message || `Some error occurred while retrieving comments for tutorial #${req.params.tutorialId}`
            })
        })
    }
}