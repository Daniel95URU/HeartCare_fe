const pool = require("../db");
const {
  insertUserProject,
  insertMember,
  removeProject,
  updateNamesProject,
  selectProject,
  removeMember,
  membersProject,
  updateMember,
  deleteMember,
  viewActivity,
  insertTask,
  checkExistingObjective,
  insertDefaultObjective,
  calendarAct 
} = require("../projectQueries");

const { checkEmailQuery } = require("../query");

class BoProject {
  constructor() {}

  async createProject(req, res) {
    try {
      const { id_per, motivo_cita: motivo_cita, id_perfil_pro } = req.body;

      const result = await pool.query(insertUserProject, [motivo_cita]);
      const cita_id = result.rows[0].icita_id;
      await pool.query(insertMember, [id_per, cita_id, id_perfil_pro]);
      res
        .status(201)
        .json({ message: "appointment created successfully", cita_id: cita_id });
    } catch (error) {
      console.error("Error creating appointment:", error);
      res
        .status(500)
        .json({ message: "Error creating appointment", error: error.message });
    }
  }

  async deleteProject(req, res) {
    try {
      const icita_id = req.params.icita_id;
      const { id_miembro, id_perfil_pro } = req.body;
      console.log(icita_id, id_miembro, id_perfil_pro);

      await pool.query("BEGIN"); // Inicia una transacción

      if (id_perfil_pro === 1) {
        await pool.query(removeMember, [id_miembro]);
        await pool.query(removeProject, [icita_id]);
      } else {
        await pool.query(removeMember, [id_miembro]);
      }

      await pool.query("COMMIT"); // Confirma la transacción

      res.status(200).json({ message: "|Cita| eliminada" });
    } catch (error) {
      await pool.query("ROLLBACK"); // Revertir la transacción en caso de error
      console.error(error);
      res.status(500).json({ message: "Error" });
    }
  }

  async updateProjectName(req, res) {
    try {
      const { id_pro, motivo_cita } = req.body;

      await pool.query(updateNamesProject, [motivo_cita, id_pro]);

      res.status(200).json({ message: "|Cita| actualizada" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error" });
    }
  }

  async getProjects(req, res) {
    try {
      const id_per = req.params.id_per;
      const result = await pool.query(selectProject, [id_per]);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching citas:", error);
      res
        .status(500)
        .json({ message: "Error", error: error.message });
    }
  }

  async addMemberProject(req, res) {
    try {
      const { correo_per, icita_id, id_perfil_pro } = req.body;
      console.log(correo_per);

      const result = await pool.query(checkEmailQuery, [correo_per]);
      const personId = result.rows[0].id_per; // extrae el valor id_per del resultado
      console.log(personId);

      await pool.query(insertMember, [personId, icita_id, id_perfil_pro]);
      res.status(201).json({ message: "The member is included", icita_id });
    } catch (error) {
      console.error("Error adding member:", error);
      res
        .status(500)
        .json({ message: "Error adding member", error: error.message });
    }
  }

  async projectMember(req, res) {
    try {
      const id_project = req.params.icita_id;
      console.log(id_project);
      const result = await pool.query(membersProject, [id_project]);
      console.log(result);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching members:", error);
      res
        .status(500)
        .json({ message: "Error fetching member", error: error.message });
    }
  }

  async editProfileMember(req, res) {
    try {
      const { id_perfil_pro, icita_id, correo_per } = req.body;
      console.log(id_perfil_pro, icita_id, correo_per);
      const result = await pool.query(checkEmailQuery, [correo_per]);
      const personId = result.rows[0].id_per; // Extract the id_per value from the result
      console.log(personId);

      await pool.query(updateMember, [id_perfil_pro, icita_id, personId]);
      res.status(201).json({ message: "The profile was changed", icita_id });
    } catch (error) {
      console.error("Error editting member:", error);
      res
        .status(500)
        .json({ message: "Error adding member", error: error.message });
    }
  }

  async deleteMember(req, res) {
    const { icita_id } = req.params;
    const { correo_per } = req.body;
    const result = await pool.query(checkEmailQuery, [correo_per]);
    const personId = result.rows[0].id_per;

    try {
      await pool.query("BEGIN");
      await pool.query(deleteMember, [icita_id, personId]);
      await pool.query("COMMIT");

      res.status(200).json({ message: "Member deleted successfully" });
    } catch (error) {
      await pool.query("ROLLBACK");
      console.error(error);
      res.status(500).json({ message: "Error deleting member" });
    }
  }

  async memberActivity(req, res) {
    try {
      const id_project = req.params.icita_id;
      console.log(id_project);
      const result = await pool.query(viewActivity, [id_project]);
      console.log(result)
      res.status(200).json( result.rows);
    } catch (error) {
      console.error("Error fetching activity:", error);
      res
        .status(500)
        .json({ message: "Error fetching activity ", error: error.message });
    }
  }

  async addTask(req, res) {
    try {
      const { des_act, fechaini_act,  duracion_act, porcentaje_act, id_obj} = req.body;
      await pool.query(insertTask, [des_act, fechaini_act,  duracion_act, porcentaje_act, id_obj]);
      res.status(201).json({ message: "The task is included", des_act });
    } catch (error) {
      console.error("Error adding task:", error);
      res
        .status(500)
        .json({ message: "Error adding task", error: error.message });
    }
  }
  async  addTask(req, res) {
    try {
      const { des_act, fechaini_act, duracion_act, porcentaje_act, icita_id } = req.body;
      let { id_obj } = req.body;

      // Check if an objective already exists for the appointment
      const existingObjectiveResult = await pool.query(checkExistingObjective, [icita_id]);

      if (existingObjectiveResult.rows.length === 0) {

        const defaultObjectiveResult = await pool.query(insertDefaultObjective, ['start proyecto', 1, icita_id]);
        id_obj = defaultObjectiveResult.rows[0].id_obj; // Get the new objective ID
      } else {
        // Use the existing objective ID
        id_obj = existingObjectiveResult.rows[0].id_obj;
      }
  
      // Insert the task with the obtained objective ID
      await pool.query(insertTask, [des_act, fechaini_act, duracion_act, porcentaje_act, id_obj]);
      
      res.status(201).json({ message: "The task is included", des_act });
    } catch (error) {
      console.error("Error adding task:", error);
      res.status(500).json({ message: "Error adding task", error: error.message });
    }
  }


  async calendarActivity(req, res) {
    try {
      const id_per= req.params.id_per;
      console.log(id_per);
      const result = await pool.query(calendarAct, [id_per]);
      console.log(result)
      res.status(200).json( result.rows);
    } catch (error) {
      console.error("Error fetching activity:", error);
      res
        .status(500)
        .json({ message: "Error fetching activity ", error: error.message });
    }
  }

}






module.exports = BoProject;
