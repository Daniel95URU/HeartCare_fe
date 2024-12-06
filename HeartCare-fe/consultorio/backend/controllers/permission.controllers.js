const pool = require('../db');
const { loadPermissionsQuery } = require('../query');

const loadPermissions = async () => {
  const permissionsMap = new Map();

  try {
    const res = await pool.query(loadPermissionsQuery);
    res.rows.forEach(row => {
      const key = `${row.des_modulo}_${row.des_clase}_${row.des_metodo}_${row.id_perfil}`;
      permissionsMap.set(key, true);
    });
  } catch (err) {
    console.error('Error loading permissions:', err);
  }

  return permissionsMap;
}

const loadPermissionsForUser = async (perfilId) => {
  try {
    const permissionsMap = await loadPermissions();
    const userPermissions = {};
    
    Array.from(permissionsMap.keys())
      .filter(key => key.endsWith(`_${perfilId}`))
      .forEach(key => {
        userPermissions[key] = permissionsMap.get(key);
      });
    
    return userPermissions;
  } catch (error) {
    console.error("Error loading permissions for user:", error);
    throw error;
  }
}

module.exports = {
  loadPermissions,
  loadPermissionsForUser
};
