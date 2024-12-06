import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import Button from '@mui/material/Button';

export default function AlertDialog({ appointmentId, memberId, profileId, onDelete }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (event) => {
    event.stopPropagation(); // Detener la propagación del evento
    setOpen(true);
  };

  const handleClose = (event) => {
    event.stopPropagation(); // Detener la propagación del evento
    setOpen(false);
  };

  const handleDelete = async (event) => {
    event.stopPropagation(); // Detener la propagación del evento
    await onDelete(appointmentId, memberId, profileId);
    handleClose(event);
  };

  return (
    <React.Fragment>
      <IconButton onClick={handleClickOpen}>
        <CancelOutlinedIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClick={(event) => event.stopPropagation()} // Detener la propagación del evento
      >
        <DialogTitle id="alert-dialog-title">
          {"Estás seguro que quieres quitar la cita?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Prueba: Si eliminas la cita solo el médico puede reabrirla.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleDelete} autoFocus>
            Sí
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
   