const { pool } = require('./connection');
const path = require('path');
const logger = require('../Logger/logger');

exports.runQuery = async (query, params) => {
    const client = await pool.connect();
    try {
        const result = await client.query(query, params);
        return result.rows;
    } catch (error) {
        logger.error('Error en la consulta:', error.message);
        throw error;
    } finally {
        client.release();
    }
};

exports.runQueryFromFile = async (queryKey, params) => {
    const queriesPath = path.join(__dirname, '../backend/json/queries.json');
    const queries = require(queriesPath);
    let query = queries;
    queryKey.split('.').forEach(key => {
        query = query[key];
    });
    if (!query) {
        throw new Error(`Consulta ${queryKey} no encontrada`);
    }
    return this.runQuery(query, params);
};

exports.executeTransaction = async ({ querys = [] }) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Iniciar la transacción
        for (const elemento of querys) {
            const { key, params } = elemento;
            const query = require(`../src/json/queries${key}.json`)[key];
            await client.query(query, params); // Ejecutar cada consulta en la transacción
        }
        await client.query('COMMIT'); // Confirmar la transacción
    } catch (error) {
        await client.query('ROLLBACK'); // Revertir la transacción
        logger.error('Transaction error:', error.message);
        throw error;
    } finally {
        client.release();
    }
};

exports.getClient = async () => {
    return await pool.connect();
};