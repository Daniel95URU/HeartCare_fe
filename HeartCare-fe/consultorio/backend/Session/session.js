const expressSession = require('express-session');
const PgSession = require('connect-pg-simple')(expressSession);
const path = require('path');
const fs = require('fs');
const logger = require('../../backend/utils/logger');

// Leer el archivo config.json
const configPath = path.join(__dirname, '../backend/config/config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

class Session {
  constructor(app, db) {
    this.db = db;
    this.configureSession(app);
  }

  configureSession(app) {
    app.use((req, res, next) => {
      logger.info('Nueva sesión creada.'); // Log de creación de sesión
      next();
    });

    app.use(
      expressSession({
        ...config.sessionConfig,
        store: new PgSession({
          pool: this.db.pool,
          tableName: 'session',
        }),
        secret: config.session.secret,
        resave: false,
        unset: 'destroy', // Destruye la sesión al cerrar
        saveUninitialized: false,
        cookie: {
          maxAge: config.session.maxAge, // Duración de la sesión
        },
      })
    );
  }

  isSessionActive(req) {
    if (req.session && req.session.userId) {
      logger.info(`Sesión activa para el usuario: ${req.session.userId}`);
      return true;
    } else {
      logger.warn('Sesión inactiva o no válida.');
      return false;
    }
  }


  async initializeUserSession(req, res) {
    const { username, password } = req.body;
    try {
      const result = await this.db.runQueryByKey({ key: 'login', params: [username, password] });
      if (result.length > 0) {
        req.session.userId = result[0].users_id;
        req.session.userName = result[0].users_na;
        req.session.userProfile = result[0].profile_id;
        res.send('Sesión creada con éxito.');
        logger.info(`Sesión inicializada para el usuario: ${users_id}`);
      } else {
        res.status(401).send('Datos inválidos, no se puede iniciar sesión.');
      }
    } catch (error) {
      logger.error(`Error al inicializar la sesión para el usuario: ${users_ud} - ${error.message}`);
      res.status(500).send('Error interno del servidor.');
    }
  }
}

module.exports = Session;
