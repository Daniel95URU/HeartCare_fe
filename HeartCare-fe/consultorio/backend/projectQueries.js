const insertUserAppointment = `
  INSERT INTO citas (des_cita, id_estado)
  VALUES ($1, 1)
  RETURNING id_cita;`;

const insertMember = `
  INSERT INTO miembro (id_per, id_cita, id_perfil_pro)
  VALUES ($1, $2, $3);`;


const removeAppointment = `
  DELETE FROM citas
  WHERE id_cita = $1;
`;

const removeMember = `
  DELETE FROM miembro 
  WHERE id_miembro=$1

`

const updateNamesAppointment = `
  UPDATE citas
  SET des_cita = $1
  WHERE id_cita = $2;
`;

const selectAppointment = `
    SELECT p.id_cita, p.des_cita, m.id_perfil_pro, m.id_miembro FROM citas p
  INNER JOIN miembro m on p.id_cita = m.id_cita WHERE id_per = $1
  GROUP BY p.id_cita, p.des_cita,  m.id_perfil_pro, m.id_miembro
`;

const membersAppointment = ` 
SELECT p.correo_per, m.id_perfil_pro FROM persona p
INNER JOIN miembro m on p.id_per=m.id_per where id_cita=$1
`;

const updateMember = `
UPDATE miembro SET id_perfil_pro = $1 WHERE id_cita=$2 AND id_per= $3
`

const deleteMember = `
DELETE FROM miembro where id_cita= $1 and id_per= $2
`
const viewActivity = `
SELECT 
    a.id_act,
    o.id_obj,
    o.des_obj,
    a.des_act,
    a.fechaini_act,
    a.porcentaje_act,
    pre.actividad_padre,
    a.info_act,
    a.recursos_act, 
    a.duracion_act
FROM actividad a
LEFT JOIN prelacion pre ON a.id_act = pre.actividad_hija
INNER JOIN objetivo o ON a.id_obj = o.id_obj 
INNER JOIN citas p ON o.id_cita = p.id_cita 
WHERE o.id_cita = $1;
`

const calendarAct = `
SELECT  a.fechaini_act, a.fechafinal_act, a.des_act FROM actividad a
INNER JOIN objetivo o ON a.id_obj = o.id_obj 
INNER JOIN citas p ON o.id_cita = p.id_cita
INNER JOIN miembro m on p.id_cita = m.id_cita where m.id_per=$1
`

const insertTask = `
INSERT INTO actividad (des_act, fechaini_act, duracion_act, porcentaje_act, id_obj)
VALUES ($1, $2, $3, $4, $5);
`;

const checkExistingObjective = `
SELECT id_obj FROM objetivo WHERE id_cita = $1;
`;

const insertDefaultObjective = `
INSERT INTO objetivo (des_obj, id_estado, id_cita)
VALUES ($1, $2, $3)
RETURNING id_obj;
`;


module.exports = {
  insertUserAppointment,
  insertMember,
  removeAppointment,
  updateNamesAppointment,
  selectAppointment,
  removeMember,
  membersAppointment,
  updateMember,
  deleteMember,
  viewActivity,
  insertTask,
  checkExistingObjective,
  insertDefaultObjective,
  calendarAct
};