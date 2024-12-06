// permission.controllers.js
const BusinessObject = require('../bo');

const invokeMethod = async (moduleKey, perfilId, params) => {
  try {
    const [modulo, clase, metodo, _perfilId] = moduleKey.split('_');

    // Crear instancia de BusinessObject
    const bo = new BusinessObject();

    // Verificar si el módulo y método existen y si el perfil tiene acceso
    if (bo[modulo] && typeof bo[modulo][metodo] === 'function') {
      // Obtener permisos específicos del usuario
      const permissionKey = `${modulo}_${clase}_${metodo}_${perfilId}`;

      // Verificar si el usuario tiene permisos para el método específico
      if (permissionsMap.has(permissionKey) && permissionsMap.get(permissionKey)) {
        bo[modulo][metodo](...params);
      } else {
        console.warn(`Acceso denegado para ${metodo} en el módulo ${modulo}`);
      }
    } else {
      console.error(`Método ${metodo} no encontrado en el módulo ${modulo}`);
    }
  } catch (error) {
    console.error('Error invoking method:', error);
    throw error;
  }
};

module.exports = {
  invokeMethod
};
