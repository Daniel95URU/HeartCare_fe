import React from 'react';
import { GanttComponent, ColumnsDirective, ColumnDirective, EditDialogFieldsDirective, EditDialogFieldDirective, Inject, Edit, Selection, Toolbar, DayMarkers } from '@syncfusion/ej2-react-gantt';
import style from "./Editing.module.css";

// Transformar datos para el componente Gantt
const transformData = (data) => {
  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.id_obj]) {
      acc[item.id_obj] = {
        TaskID: item.id_obj,
        TaskName: item.des_obj,
        subtasks: []
      };
    }
    acc[item.id_obj].subtasks.push({
      TaskID: item.id_act,
      TaskName: item.des_act,
      StartDate: item.fechaini_act ? new Date(item.fechaini_act) : null,
      Duration: item.duracion_act || null,
      Progress: item.porcentaje_act || 0,
      Predecessor: item.actividad_padre || null,
      recourse: item.recursos_act || null,
      Notes: item.info_act || null
    });
    return acc;
  }, {});

  // Ordenar los datos agrupados por TaskID
  return Object.values(groupedData).map(task => ({
    ...task,
    subtasks: task.subtasks.sort((a, b) => a.TaskID - b.TaskID) // Ordenar subtareas
  })).sort((a, b) => a.TaskID - b.TaskID); // Ordenar tareas principales
};


// Crear una nueva tarea en el servidor
const createTask = async (task) => {
  console.log(task);
  try {
    const response = await fetch('http://localhost:3000/addtask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        des_act: task.TaskName,
        fechaini_act: task.StartDate ? new Date(task.StartDate).toISOString().split('T')[0] : null,
        duracion_act: task.Duration || null,
        porcentaje_act: task.Progress || 0,
        id_obj: task.id_obj, // Pasar id_obj correctamente
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create task');
    }

    const result = await response.json();
    console.log('Task created:', result);
  } catch (error) {
    console.error('Error creating task:', error);
  }
};

const Editing = ({ project, projectDetails }) => {
  const [tasks, setTasks] = React.useState([]);
  const [projectStartDate, setProjectStartDate] = React.useState(null);
  const [projectEndDate, setProjectEndDate] = React.useState(null);

  // Efecto para transformar y establecer datos del proyecto
  React.useEffect(() => {
    if (projectDetails) {
      const transformedData = transformData(projectDetails);
      setTasks(transformedData);

      // Filtrar actividades sin precedencias
      const startDatesWithoutPredecessor = transformedData.flatMap(task =>
        task.subtasks
          .filter(subtask => !subtask.Predecessor)
          .map(subtask => subtask.StartDate)
      ).filter(date => date);

      if (startDatesWithoutPredecessor.length > 0) {
        const minDate = new Date(Math.min(...startDatesWithoutPredecessor.map(date => date.getTime())));
        const maxDate = new Date(minDate);
        maxDate.setMonth(minDate.getMonth() + 3); // Añadir 3 meses

        setProjectStartDate(minDate);
        setProjectEndDate(maxDate);
      }
    }
  }, [projectDetails]);

  // Configuración de campos de tareas
  const taskFields = {
    id: 'TaskID',
    name: 'TaskName',
    startDate: 'StartDate',
    duration: 'Duration',
    progress: 'Progress',
    dependency: 'Predecessor',
    child: 'subtasks',
    notes: 'Notes',
    resourceInfo: 'recourse'
  };

  // Configuración de edición
  const editSettings = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true,
    allowTaskbarEditing: true,
    showDeleteConfirmDialog: true
  };

  const splitterSettings = {
    position: "35%"
  };

  const gridLines = 'Both';
  const toolbar = ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Indent', 'Outdent'];
  const timelineSettings = {
    topTier: {
      unit: 'Week',
      format: 'MMM dd, y',
    },
    bottomTier: {
      unit: 'Day',
    },
  };

  const labelSettings = {
    leftLabel: 'TaskName',
    rightLabel: 'recourse'
  };

  // Plantilla de la barra de tareas
  const taskbarTemplate = (props) => {
    if (!props || !props.ganttProperties) {
      return null;
    }

    return (
      <div className="e-gantt-taskbar" style={{ backgroundColor: '#4dc869', color: 'white', height: '100%', borderRadius: '5px' }}>
        <div className="e-taskbar-main-container">
          <div className="e-taskbar-left"></div>
          <div className="e-taskbar-right"></div>
          <div className="e-child-taskbar-inner-div e-taskbar-main-div e-taskbar">
            {/* Dejar vacío para no mostrar texto */}
          </div>
        </div>
      </div>
    );
  };

  // Manejar la acción completa (agregar tarea)
  const handleActionComplete = (args) => {
    if (args.requestType === 'add') {
      const newTask = args.data;
      const parentTaskId = args.parentData?.TaskID; // Obtener el ID de la tarea padre

      // Determinar el valor adecuado de id_obj
      const id_obj = parentTaskId || newTask.TaskID; // Usar parentTaskId si está disponible, de lo contrario, usar TaskID

      // Actualizar el estado local
      const updatedTasks = [...tasks.filter(task => task.TaskID !== newTask.TaskID), newTask].sort((a, b) => a.TaskID - b.TaskID);
      setTasks(updatedTasks);
      
      // Enviar la nueva tarea al servidor
      createTask({
        TaskName: newTask.TaskName,
        StartDate: newTask.StartDate,
        Duration: newTask.Duration || null,
        Progress: newTask.Progress || 0,
        id_obj: id_obj, 
      });
    }
  };

  return (
    <div className={style.controlPane}>
      <div className='control-section'>
        <GanttComponent
          id='Editing'
          dataSource={tasks}
          dateFormat={'MMM dd, y'}
          treeColumnIndex={1}
          allowSelection={true}
          showColumnMenu={false}
          highlightWeekends={true}
          allowUnscheduledTasks={true}
          projectStartDate={projectStartDate}
          projectEndDate={projectEndDate}
          taskFields={taskFields}
          timelineSettings={timelineSettings}
          labelSettings={labelSettings}
          splitterSettings={splitterSettings}
          height='300px'
          editSettings={editSettings}
          gridLines={gridLines}
          toolbar={toolbar}
          width="100%"
          taskbarTemplate={taskbarTemplate}
          actionComplete={handleActionComplete}
        >
          <ColumnsDirective>
            <ColumnDirective field='TaskID' width='80'></ColumnDirective>
            <ColumnDirective field='TaskName' headerText='Job Name' width='250' clipMode='EllipsisWithTooltip'></ColumnDirective>
            <ColumnDirective field='StartDate'></ColumnDirective>
            <ColumnDirective field='Duration'></ColumnDirective>
            <ColumnDirective field='Progress'></ColumnDirective>
            <ColumnDirective field='Predecessor'></ColumnDirective>
          </ColumnsDirective>
          <EditDialogFieldsDirective>
            <EditDialogFieldDirective type='General' headerText='General'></EditDialogFieldDirective>
            <EditDialogFieldDirective type='Dependency'></EditDialogFieldDirective>
            <EditDialogFieldDirective type='Resources'></EditDialogFieldDirective>
            <EditDialogFieldDirective type='Notes'></EditDialogFieldDirective>
          </EditDialogFieldsDirective>
          <Inject services={[Edit, Selection, Toolbar, DayMarkers]} />
        </GanttComponent>
      </div>
    </div>
  );
};

export default Editing;
