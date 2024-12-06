// queries.js
const loadPermissionsQuery = `
   SELECT 
    p.id_perfil,
    p.des_perfil,
    m.des_modulo,
    c.des_clase,
    met.des_metodo
  FROM perfil p
  LEFT JOIN perfil_mod pm ON p.id_perfil = pm.id_perfil
  LEFT JOIN modulo m ON pm.id_modulo = m.id_modulo
  LEFT JOIN modulo_clase mc ON m.id_modulo = mc.id_modulo
  LEFT JOIN clase c ON mc.id_clase = c.id_clase
  LEFT JOIN metodo met ON c.id_clase = met.id_clase;
`;

const userQuery = `
 SELECT 
  u.id_usu, 
  u.id_per, 
  p.correo_per, 
  u.password_usu, 
  up.id_perfil
FROM usuario u
INNER JOIN usuario_perfil up ON u.id_per = up.id_usu
INNER JOIN persona p ON u.id_per = p.id_per
WHERE p.correo_per = $1
  AND u.password_usu = $2

`;

const personQuery = `
SELECT id_per FROM usuario where id_usu=$1
`

const updateQuery = `
  UPDATE usuario
  SET secret_token_usu = $1, expirestoken_usu = $2
  WHERE id_per = $3
`;

const checkEmailQuery = `
  SELECT id_per FROM persona
  WHERE correo_per = $1
  `;

const insertPersonQuery = `
  INSERT INTO persona (nombre_per, tlf_per, correo_per, des_per)
  VALUES ($1, $2, $3, $4)
  RETURNING id_per;
`;  

const insertUserQuery = `
  INSERT INTO usuario (id_per, password_usu)
  VALUES ($1, $2)
   RETURNING id_usu;
 `;

 const insertUserProfileQuery = `
  INSERT INTO usuario_perfil (id_usu, id_perfil)
  VALUES ($1, $2);
    `;

  const checkProfile = `
  SELECT 
    `;


module.exports = {
  loadPermissionsQuery,
  userQuery,
  updateQuery,
  checkEmailQuery,
  insertPersonQuery,
  insertUserQuery,
  insertUserProfileQuery,
  personQuery
};

