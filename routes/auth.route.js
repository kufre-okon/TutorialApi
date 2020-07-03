
module.exports = function (app) {

    const { verifySignUp } = require('../middleware')
    const controller = require('../controllers/auth.controller')
    const router = require('express').Router();

    router.post(
        '/signup',
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted
        ],
        controller.signup
    );

    router.post('/signin', controller.signin);

    app.use('/api/auth', router);
}