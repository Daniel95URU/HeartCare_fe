const session = require('express-session');
const path = require('path');
const fs = require('fs');

const configureSession = (app) => {
    const configPath = path.join(__dirname, '../config/config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    app.use(session({
        secret: config.sessionConfig.secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            maxAge: config.sessionConfig.cookie.maxAge
        }
    }));
};

module.exports = { configureSession };
