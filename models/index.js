const dbConfig = require('../config/db.config');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.tutorials = require('./tutorial.model.js')(sequelize, Sequelize);
db.comments = require('./comment.model.js')(sequelize, Sequelize);
db.users = require('./user.model.js')(sequelize, Sequelize);
db.roles = require('./role.model.js')(sequelize, Sequelize);

db.roles.belongsToMany(db.users, {
    through: 'userRoles',
    foreignKey: 'roleId',
    otherKey: 'userId'
});
db.users.belongsToMany(db.roles, {
    through: 'userRoles',
    foreignKey: 'userId',
    otherKey: 'roleId'
});

db.tutorials.hasMany(db.comments, { as: 'comments' });
db.comments.belongsTo(db.tutorials, {
    foreignKey: 'tutorialId', as: 'tutorial'
});

db.ROLES = ['User', 'Admin'];

module.exports = db;