const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

var corsOptions = {
    origin: ['http://localhost:7070', 'http://localhost:3000']
}

app.use(cors(corsOptions));

const db = require('./models/index');
db.sequelize.sync().then(() => {
    console.log("Re-sync db.");
    initData();
});

function initData() {
    db.roles.count().then((c) => {
        if (c < 2) {
            db.roles.create({
                id: 1,
                name: 'User'
            });
            db.roles.create({
                id: 2,
                name: 'Admin'
            })
        }
    })
}
/*
db.sequelize.sync({ force: true }).then(() => {
    console.log("Drop and re-sync db.");
}); */

// parse requests of content-type 'application/json'
app.use(bodyParser.json());

// parse requests of content-type 'application/www-form-urlencoded'
app.use(bodyParser.urlencoded({ extended: true }));

// simple route 
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to kufre tutorial API application.' });
})

app.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );

    next();
});

// bind routes
require('./routes/tutorial.route.js')(app);
require('./routes/comment.route.js')(app);
require('./routes/auth.route.js')(app);
require('./routes/user.route.js')(app);

// custom 404 page
app.use((req, res) => {
    res.status(404).send({ message: "The requested resource not found." });
});

// error handler
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something went wrong!')
  })

// set port, listen for requests
const PORT = process.env.PORT || 7071;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.\n Ctrl+C to stop.`);
})