const express = require('express');
const { configureApp } = require('./config/appConfig');
const { configureSession } = require('./config/sessionConfig');
const startRoutes = require('./routes/start.routes');
const logger = require('./utils/logger');

const app = express();
const port = process.env.PORT || 3000;


configureApp(app); 
configureSession(app);

app.use((req, res, next) => {
  logger.info(`Solicitud recibida: ${req.method} ${req.url}, sesión activa.`);
  next();
});

app.use((req, res, next) => {
  logger.debug(`CORS ejecutado para ${req.method} ${req.url}`);
  next();
});

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Bienvenido a la página principal');
});

app.use(express.json());
app.use("/", startRoutes)
// Iniciar el servidor
app.listen(port, () => {
  logger.info(`Servidor escuchando en el puerto ${port}`);
});
