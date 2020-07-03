module.exports = (app) => {

    const { authJwt } = require('../middleware');
    const tutorials = require('../controllers/tutorial.controller.js');

    var router = require('express').Router();
    
    router.use(authJwt.verifyToken);

    // creat a new tutorial
    router.post('/', tutorials.create);

    // retrieve all tutorials
    router.get('/', tutorials.findAll);

    // Retrieve all published Tutorials
    router.get("/published", tutorials.findAllPublished);

    // Retrieve a single Tutorial with id
    router.get("/:id", tutorials.findOne);

    // Update a Tutorial with id
    router.put("/:id", tutorials.update);

    // Delete a Tutorial with id
    router.delete("/:id", tutorials.delete);

    // Create a new Tutorial
    router.delete("/", tutorials.deleteAll);


    app.use('/api/tutorials', router);
}