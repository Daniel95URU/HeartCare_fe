const pool = require("../db");
const { Resend } = require("resend");
const crypto = require("crypto");
const { userQuery, updateQuery, checkEmailQuery, insertPersonQuery, insertUserProfileQuery, insertUserQuery,
  personQuery
 } = require('../query');
const { loadPermissionsForUser } = require("./permission.controllers");

const resend = new Resend("re_4CVKeLqM_MJ1D3GhHhVdXnvqAGxxV1ktx");

const createLogin = async (req, res) => {
  try {
    const { correo_per, password_usu } = req.body;

    const result = await pool.query(userQuery, [correo_per, password_usu]);
    console.log(result)
    
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      
      if (user.password_usu === password_usu) {
        req.session.isLoggedIn = true;
        req.session.username = correo_per;
        req.session.password = password_usu;
        const sessionId = req.session.id;
        const personId = user.id_per;
        const profileUser = user.id_perfil
        
        console.log(`La ID de la session es: ${sessionId}`);
        
        // Load permissions and set them in the session
        const permissions = await loadPermissionsForUser(user.id_per);
        req.session.permissions = permissions;

        res.status(200).json({ success: true, message: "Login exitoso", permissions, personId, profileUser });
        return;
      }
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("Error destruyendo la sesión: ", err);
      }
      res.status(401).json({ success: false, message: "Usuario o contraseña equivocadas" });
    });
  } catch (err) {
    console.error("Error querying user data:", err);
    res.status(500).json({ success: false, message: "Error en el query de los datos" });
  }
}

const recoverPassword = async (req, res) => {
  const correo_per = req.body.correo_per;
  console.log(`Enviada el recovery del correo: ${correo_per}`);

  try {
    const checkEmailResult = await pool.query(checkEmailQuery, [correo_per]);

    if (checkEmailResult.rows.length === 0) {
      return res.status(404).send("No se encontró una cuenta con ese correo electrónico");
    }

    const { id_per } = checkEmailResult.rows[0];
    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hora

    await pool.query(updateQuery, [token, expires, id_per]);

    const data = await resend.emails.send({
      from: "DAN <danrecorver@resend.dev>",
      to: [correo_per],
      subject: "Recuperación de tu contraseña",
      html: `Your password reset token is: ${token}`,
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(400).json({ error: error.message });
  }
}

const createSignup = async (req, res) => {
  const { nombre, tlf_per, correo_per, des_per, password_usu } = req.body;
  console.log(`Received request to signup: ${correo_per}`);

  try {
    // Verificar si el correo ya está registrado
    const checkEmailResult = await pool.query(checkEmailQuery, [correo_per]);

    if (checkEmailResult.rows.length > 0) {
      return res.status(400).send("Ya estás logueado");
    }

    // Insertar la nueva persona
    const insertPersonResult = await pool.query(insertPersonQuery, [nombre, tlf_per, correo_per, des_per]);
    const newPersonId = insertPersonResult.rows[0].id_per;

    // Insertar el nuevo usuario
    const insertUserResult = await pool.query(insertUserQuery, [newPersonId, password_usu]);
    const newUserId = insertUserResult.rows[0].id_usu;

    // Asociar el nuevo usuario con el perfil de usuario
    const userProfileId = 4; // Suponiendo que el perfil de usuario tiene el id 4
    await pool.query(insertUserProfileQuery, [newUserId, userProfileId]);

    res.status(201).send("Te has registrado correctamente");
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  createLogin,
  recoverPassword,
  createSignup
};
