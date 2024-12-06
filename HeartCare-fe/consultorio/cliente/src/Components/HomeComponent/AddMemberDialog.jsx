import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Box
} from "@mui/material";
import ControllableStates from "./ControllableStates";

const AddMemberDialog = ({ appointmentId }) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState('Member');

  const profileOptions = ['Doctor', 'Only Read'];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsSubmitting(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const memberEmail = formData.get("EmailName");
    const profileId = profile === 'Member' ? '2' : '3';

    try {
      const response = await fetch("http://localhost:3000/addmember", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo_per: memberEmail,
          id_proyecto: appointmentId,
          id_perfil_pro: profileId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error");
      }

      const result = await response.json();
      handleClose();
    } catch (error) {
      console.error("Error:", error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <React.Fragment>
      <Button
        variant="text"
        onClick={handleClickOpen}
        sx={{
          color: "#4dc869",
          borderColor: "#4dc869",
          "&:hover": {
            borderColor: "#4dc869",
            backgroundColor: "rgba(77, 200, 105, 0.1)",
          },
        }}
      >
        Add Member
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Añade un Médico</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Si el cliente tiene una cuenta, escribe su correo para agendar una cita.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="emailuser"
            name="EmailName"
            label="Write member's email"
            type="email"
            fullWidth
            variant="standard"
            sx={{
              "& .MuiInput-underline:before": { borderBottomColor: "#4dc869" },
              "& .MuiInput-underline:after": { borderBottomColor: "#4dc869" },
              "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                borderBottomColor: "#4dc869",
              },
              "& .Mui-focused": {
                color: "#4dc869",
              },
            }}
          />
        </DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', marginRight: 2 }}>
          <ControllableStates
            value={profile}
            onChange={setProfile}
            options={profileOptions}
            labelName = {"profile"}
          />
        </Box>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default AddMemberDialog;
