// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';

const CalendarProject = () => {
  const [events, setEvents] = useState([]);
  const localizer = dayjsLocalizer(dayjs);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3000/calendar/1');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const transformedEvents = data.map(event => ({
          title: event.des_act,
          start: event.fechaini_act ? dayjs(event.fechaini_act).toDate() : null,
          end: event.fechafinal_act ? dayjs(event.fechafinal_act).toDate() : null,
        }));

        setEvents(transformedEvents);
      } catch (error) {
        console.error('Error en el fetch', error);
      }
    };

    fetchEvents();
  }, []);

  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor = '#4dc869'; 
    if (event.title === 'Evento 1') {
      backgroundColor = '#ff0000'; 
    }

    const style = {
      backgroundColor,
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    };

    return {
      style,
    };
  };

  return (
    <div style={{
      height: "95vh",
      width: "70vw",
      display: "flex",
      margin: "0 auto",
      overflow: "auto", // Add scroll if overflow
      position: "relative", // Ensure proper positioning
      left: "", // Start from left edge
      padding: "10px" // Optional padding for better spacing
    }}>
      <Calendar
        localizer={localizer}
        events={events}
        eventPropGetter={eventStyleGetter}
        style={{
          height: "70%", 
          width: "80%", 
        }}
      />
    </div>
  );
};

export default CalendarProject;
