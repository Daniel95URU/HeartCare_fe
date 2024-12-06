const MethodService = require('../services/methodService');

exports.invokeMethod = async (req, res) => {
  // Instanciar el servicio con la base de datos del request
  const methodService = new MethodService(req.db);

  try {
    // Invocar el método desde el servicio con la sesión y los datos del cuerpo de la solicitud
    const result = await methodService.invokeMethod(req.session, req.body);
    res.status(200).json(result);
  } catch (error) {
    // Manejo de errores con códigos de estado apropiados
    if (error.message.includes("Debe iniciar sesión")) {
      res.status(401).json({ error: error.message });
    } else if (error.message.includes("No tiene permiso")) {
      res.status(403).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};
