import * as React from 'react';
import { useEffect } from 'react';
import { GanttComponent, Inject, Selection, ColumnDirective, ColumnsDirective, VirtualScroll } from '@syncfusion/ej2-react-gantt';
import { data } from './data';
const Virtualscroll = () => {
    const taskFields = {
        id: 'TaskID',
        name: 'TaskName',
        startDate: 'StartDate',
        endDate: 'EndDate',
        duration: 'Duration',
        progress: 'Progress',
        parentID: 'parentID'
    };
    const splitterSettings = {
        columnIndex: 2
    };
    const labelSettings = {
        taskLabel: 'Progress'
    };
    const projectStartDate = new Date('04/01/2024');
    const projectEndDate = new Date('12/31/2030');
    return (<div className='control-pane'>
      <div className='control-section'>
        <GanttComponent id='SplitTasks' dataSource={data} treeColumnIndex={1} labelSettings={labelSettings} allowSelection={true} highlightWeekends={true} enableVirtualization={true} enableTimelineVirtualization={true} taskFields={taskFields} splitterSettings={splitterSettings} height='450px' projectStartDate={projectStartDate} projectEndDate={projectEndDate}>
          <ColumnsDirective>
            <ColumnDirective field='TaskID'/>
            <ColumnDirective field='TaskName' headerText='Task Name'/>
            <ColumnDirective field='StartDate'/>
            <ColumnDirective field='Duration'/>
            <ColumnDirective field='Progress'/>
          </ColumnsDirective>
          <Inject services={[Selection, VirtualScroll]}/>
        </GanttComponent>
      </div>
    </div>);
};
export default Virtualscroll;