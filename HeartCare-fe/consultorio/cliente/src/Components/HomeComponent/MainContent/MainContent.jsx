import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  ListItem,
  ListItemText,
  Input,
  CircularProgress,
  Avatar,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import FormDialog from "../FormDialog";
import AlertDialog from "../AlertDialog";
import AddMemberDialog from "../AddMemberDialog";
import EditMemberDialog from "../EditMemberDialog";
import Editing from "../Editing/Editing";

const MainContent = ({ personId }) => {
  const [appointments, setAppointment] = useState([]);
  const [selectedappointment, setSelectedappointment] = useState(null);
  const [appointmentDetails, setappointmentDetails] = useState(null);

  const fetchAppointment = async () => {
    try {
      const response = await fetch(`http://localhost:3000/allappointment/${personId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setAppointment(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchappointmentDetails = async (id_proyecto) => {
    console.log(id_proyecto)
    try {
      const response = await fetch(`http://localhost:3000/getactivity/${id_proyecto}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const dataAct = await response.json();
      setappointmentDetails(dataAct);
    } catch (error) {
      console.error("Error fetching appointment details:", error);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, [personId]);

  const handleCreateappointment = async (newappointmentData) => {
    try {
      const response = await fetch("http://localhost:3000/createappointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newappointmentData),
      });

      if (!response.ok) {
        throw new Error("Network response was not okk");
      }

      // Fetch appointments after a successful appointment creation
      fetchAppointment();
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  };

  const handleDeleteappointment = async (id_proyecto, id_miembro, id_perfil_pro) => {
    try {
      const response = await fetch(`http://localhost:3000/deleteappointment/${id_proyecto}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_miembro, id_perfil_pro }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setAppointment(appointments.filter((appointment) => appointment.id_proyecto !== id_proyecto));
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const handleappointmentClick = async (appointment) => {
    setSelectedappointment(appointment);
    await fetchappointmentDetails(appointment.id_proyecto);
  };

  return (
    <Box sx={{ padding: 5, display: "flex", flexDirection: "column", width: "100%", overflow: "hidden" }}>
      <Box sx={{ position: "sticky", top: 0, left: 0, backgroundColor: "white", zIndex: 1, width: "100%" }}>
        <Typography variant="h2" sx={{ color: "#007599", fontFamily: "Roboto, sans-serif", fontSize: "4.5rem", fontWeight: "bold", textAlign: "start", marginBottom: 3, marginTop: 0, paddingTop: 2 }}>
          CITAS
        </Typography>
        <Box sx={{ marginBottom: 5 }}>
          <Input color="success" size="lg" variant="solid" fullWidth  />
        </Box>
        <Box sx={{ marginBottom: 1 }}>
          <FormDialog onCreate={handleCreateappointment} personId={personId} />
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", padding: 2, borderRadius: 1, flexWrap: "wrap", marginTop: 3, overflow: "auto", maxHeight: "calc(100vh - 200px)" }}>
        {appointments.map((appointment, index) => (
          <ListItem
            key={index}
            sx={{ margin: 1, backgroundColor: "#F7F7F7", borderRadius: 3, padding: 1, width: 300, height: 100, display: "flex", alignItems: "center", justifyContent: "space-around", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)", position: "relative", cursor: "pointer" }}
            onClick={() => handleappointmentClick(appointment)}
          >
            <AlertDialog
              appointmentId={appointment.id_proyecto}
              memberId={appointment.id_miembro}
              profileId={appointment.id_perfil_pro}
              onDelete={handleDeleteappointment}
            />
            <Box>
              <ListItemText
                primary={appointment.des_proyecto}
                primaryTypographyProps={{ sx: { textAlign: "center", color: "#007599", fontSize: "1.5rem", fontFamily: "Roboto, sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" } }}
              />
              <Box sx={{ background: "#34c0eb", height: 25, borderRadius: 3, display: "flex" }}>
                <Typography
                  variant="h2"
                  sx={{ color: "white", fontFamily: "Roboto, sans-serif", fontSize: "1rem", position: "relative", fontWeight: "bold", textAlign: "center", alignItems: "center", margin: "auto" }}
                >
                  Pendiente
                </Typography>
              </Box>
            </Box>

            <Box sx={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <CircularProgress variant="determinate" value={Math.random() * 100} sx={{ color: "#34c0eb" }} size={60} />

            </Box>
          </ListItem>
        ))}
      </Box>
      {selectedappointment && appointmentDetails && (
        <Box
          sx={{ marginTop: 5, padding: 2, backgroundColor: "#fff", borderRadius: 3, boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)", overflow: "auto", maxHeight: "calc(100vh - 300px)", maxWidth: "50%", marginLeft: "13%", position: "relative" }}
        >
          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            {selectedappointment.des_proyecto}
          </Typography>

          {selectedappointment.id_perfil_pro === 1 && (
            <>
              <AddMemberDialog appointmentId={selectedappointment.id_proyecto} />
              <EditMemberDialog appointmentId={selectedappointment.id_proyecto} />
            </>
          )}

          <IconButton onClick={() => setSelectedappointment(null)} sx={{ position: "absolute", top: 10, right: 10 }}>
            <Close />
          </IconButton>

          <Box
            sx={{ marginTop: 5, padding: 2, backgroundColor: "#fff", borderRadius: 3, boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)", height: "400px", width: "3000px", overflow: "hidden", maxWidth: "100%" }}
          >
            <Editing appointment={selectedappointment} appointmentDetails={appointmentDetails} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MainContent;
