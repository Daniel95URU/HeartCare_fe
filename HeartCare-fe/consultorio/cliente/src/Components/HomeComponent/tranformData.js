export const transformData = (data) => {
    const groupedData = data.reduce((acc, item) => {
      if (!acc[item.id_obj]) {
        acc[item.id_obj] = {
          TaskID: item.id_obj,
          TaskName: item.des_obj,
          subtasks: []
        };
      }
      if (item.actividad_padre !== null) {
        acc[item.id_obj].subtasks.push({
          TaskID: item.id_act,
          TaskName: item.des_act,
          StartDate: item.fechaini_act ? new Date(item.fechaini_act).toLocaleDateString('en-US') : null,
          Duration: item.duration_act || null,
          Progress: item.porcentaje_act || 0,
          Predecessor: item.actividad_padre,
          recourse: item.recursos_act || null
        });
      }
      return acc;
    }, {});
  
    return Object.values(groupedData);
  };