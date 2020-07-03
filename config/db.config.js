module.exports = {
    HOST: "localhost",
    USER: 'root',
    PASSWORD: 'kufre2412',
    DB: 'tutorialdb',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}