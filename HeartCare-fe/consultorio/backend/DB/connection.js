const { Pool } = require('pg');
const config = require('../src/config/config.json'); // Lee la configuración desde json
const logger = require('../Logger/logger');

const pool = new Pool(config.dbConfig);

pool.on('connect', () => {
    logger.info('Conexión a la base de datos establecida');
});

pool.on('error', (error) => {
    logger.error(`Error en la conexión a la base de datos: ${error.message}`);
});

const openDatabaseConnection = async () => {
    try {
        return await pool.connect();
    } catch (error) {
        logger.error('Database connection error:', error.message);
        throw error;
    }
};

const closeConnectionPool = async () => {
    try {
        await pool.end();
        logger.info('Conexión a la base de datos cerrada.');
    } catch (error) {
        logger.error('Error releasing pool:', error.message);
        throw error;
    }
};

module.exports = {
    pool,
    openDatabaseConnection,
    closeConnectionPool,
};
