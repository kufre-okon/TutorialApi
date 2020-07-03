
module.exports = (app) => {

    const { authJwt } = require('../middleware');
    const controller = require('../controllers/user.controller');
    const router = require('express').Router();

    router.use(authJwt.verifyToken);

    router.get('/list', controller.list);

    router.get('/:id', controller.findOne);

    router.put('/changepassword', controller.changePassword);

    router.put('/changestatus', controller.updateStatus);
    

    app.use('/api/user', router)
}