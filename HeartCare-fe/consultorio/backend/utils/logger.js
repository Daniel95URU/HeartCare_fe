const { createLogger, format, transports } = require('winston');

const logger = createLogger({
    level: 'info', // Nivel mínimo que se registrará
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.json() // Formato JSON para los logs
    ),
    transports: [
        new transports.Console({ // Log en consola
            format: format.combine(
                format.colorize(), // Colorea logs en consola
                format.simple() // Formato simplificado para lectura rápida
            ),
        }),
        new transports.File({ filename: 'logs/error.log', level: 'error' }), // Solo errores
        new transports.File({ filename: 'logs/combined.log' }) // Todos los niveles
    ],
});

module.exports = logger;
