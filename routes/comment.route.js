module.exports = (app) => {

    const { authJwt } = require('../middleware');
    const comments = require('../controllers/comment.controller.js');

    var router = require('express').Router();

    router.use(authJwt.verifyToken);

    // creat a new Comment
    router.post('/', comments.create);

    // retrieve all tutorials
    router.get('/', comments.findAll);

    // Get Tutorial comments
    router.get("/tutorial/:tutorialId", comments.findByTutorial);

    // Retrieve a single Comment with id
    router.get("/:id", comments.findOne);

    // Update a Comment with id
    router.put("/:id", comments.update);

    // Delete a Comment with id
    router.delete("/:id", comments.delete);

    // Delete all Comment
    router.delete("/", comments.deleteAll);

    app.use('/api/comments', router);
}