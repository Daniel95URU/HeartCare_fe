const logger = require("../../backend/utils/logger");

class Security {
  constructor(db) {
    this.db = db;
    this.permissions = new Map();
    this.loadAllPermissions(); // Cargar todos los permisos al iniciar el servidor
  }

  // Cargar todos los permisos para todos los perfiles
  async loadAllPermissions() {
    try {
      const result = await this.db.runQueryByKey({ key: 'getAllPermissions' });
      logger.info(`Permisos cargados: ${result.length} registros encontrados.`);
      if (!result || !result.length) {
        logger.warn('No se encontraron permisos en la base de datos.');
        return;
      }
      result.forEach((element) => {
        let key = `${element.profile_id}_${element.method_na}_${element.object_na}`;
        logger.info("Cargando permiso para la clave:", key);
        this.permissions.set(key, true); // Almacenar el permiso en el Map
      });
    } catch (error) {
      logger.error(`Error al cargar los permisos: ${error.message}`);
    }
  }

  // Verificar si el perfil tiene el permiso para el objeto/método
  getPermission(jsonData) {
    let key = `${jsonData.userProfile}_${jsonData.methodName}_${jsonData.objectName}`;
    logger.info(`Checking permission for key: ${key}`);
    const hasPermission = this.permissions.has(key);
    if (!hasPermission) {
      logger.warn(`Permiso denegado para la clave: ${key}`);
    }
    logger.info(`Permission for key ${key}: ${hasPermission}`);
    return hasPermission ? this.permissions.get(key) : false;
  }

  // Ejecutar el metodo en el BO correspondiente
  async invokeMethod(jsonData) {
    const { userProfile, methodName, objectName, params } = jsonData;
    const permissionKey = `${userProfile}_${methodName}_${objectName}`;

    logger.info(`Checking permission for key: ${permissionKey}`);

    // Verifica si el usuario tiene el permiso necesario
    if (!this.getPermission(jsonData)) {
      throw new Error('Permiso denegado'); // Lanza el error si no tiene permisos
    }

    // Resto del código para invocar el metodo
    try {
      // Aquí debería estar la lógica para ejecutar el metodo solicitado
      const result = await this.executeBusinessMethod(objectName, methodName, params);
      return result;
    } catch (error) {
      logger.error(`Error ejecutando el método '${methodName}' en el BO '${objectName}':`, error);
      throw new Error(`Error ejecutando el método '${methodName}' en el BO '${objectName}'`);
    }
  }

  async executeBusinessMethod(objectName, methodName, params) {
    // Implementación específica de la ejecución del metodo del BO
    const BusinessObject = require(`./BO/${objectName}`); // Ajusta la ruta aquí
    const businessInstance = new BusinessObject(this.db);
    return await businessInstance[methodName](params);
  }
}

module.exports = Security;