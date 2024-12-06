
const logger = require('../Logger/logger');
const Session = require('../Session/session');
const Security = require('../Security/security');

// Dispatcher centralizado: valida sesión, permisos, y ejecuta lógica de negocio
const dispatcher = (allowedRoles, db) => {
    return async (req, res, next) => {
        try {
            // 1. Validar la sesión
            const session = new Session(null, db); // Instancia del servicio de sesión
            if (!session.isSessionActive(req)) {
                logger.warn(`Sesión inválida o expirada para ${req.url}`);
                return res.status(401).json({ error: "Debe iniciar sesión para acceder a este recurso." });
            }

            // 2. Validar permisos
            const security = new Security(db); // Instancia del servicio de seguridad
            const jsonData = {
                userProfile: req.session.userProfile,
                methodName: req.body.methodName,
                objectName: req.body.objectName,
                params: req.body.params,
            };

            if (!security.getPermission(jsonData)) {
                logger.warn(`Permiso denegado para userProfile: ${req.session.userProfile} en ${req.url}`);
                return res.status(403).json({ error: "No tiene permiso para acceder a este recurso." });
            }

            // 3. Ejecutar método si corresponde
            if (req.body.methodName && req.body.objectName) {
                try {
                    const result = await security.invokeMethod(jsonData);
                    res.status(200).json({ message: "Método ejecutado con éxito", result });
                } catch (error) {
                    logger.error(`Error ejecutando método: ${error.message}`);
                    return res.status(500).json({ error: "Error al ejecutar el método en el BO." });
                }
            } else {
                next(); // Continuar al controlador si no hay método/objeto en la solicitud
            }
        } catch (error) {
            logger.error(`Error en el Dispatcher: ${error.message}`);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    };
};

module.exports = dispatcher;
