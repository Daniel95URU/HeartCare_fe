import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function FormDialog({ onCreate, personId }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const appointmentName = formData.get("appointmentName");

    try {
      const response = await fetch("http://localhost:3000/createappointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_per: personId,
          motivo_cita: appointmentName,
          id_perfil_pro: "1",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error creating appointment");
      }

      const result = await response.json();
      onCreate(result); // Asegúrate de que result contenga todos los datos necesarios
      handleClose();
    } catch (error) {
      console.error("Error:", error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <React.Fragment>
      <Button
        variant="outlined"
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
        Crear cita
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Crear una cita</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Es importante que el titulo de la cita tenga relacion con el procedimiento a seguir
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="appointmentName"
            label="Escribe el nombre de la cita"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
