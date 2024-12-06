import React, { useState, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
} from "@mui/material";
import ControllableStates from "./ControllableStates";

const EditMemberDialog = ({ appointmentId }) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState("Member");
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [idPerfilPro, setIdPerfilPro] = useState("");
  const [action, setAction] = useState("Edit");

  const profileOptions = ["Member", "Only Read"];

  const handleClickOpen = async () => {
    setOpen(true);
    try {
      const response = await fetch(`http://localhost:3000/getmember/${appointmentId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error fetching members");
      }
      const result = await response.json();
      const emailList = result.map((member) => ({
        email: member.correo_per,
        profile: member.id_perfil_pro,
      }));
      setEmails(emailList);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setIsSubmitting(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (action === "Edit") {
      const profileId = profile === "Member" ? "2" : "3";

      try {
        const response = await fetch("http://localhost:3000/updatemember", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            correo_per: selectedEmail,
            id_proyecto: appointmentId,
            id_perfil_pro: profileId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error updating member");
        }

        handleClose();
      } catch (error) {
        console.error("Error:", error.message);
        setIsSubmitting(false);
      }
    } else if (action === "Delete") {
      try {
        const response = await fetch(`http://localhost:3000/removemember/${appointmentId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            correo_per: selectedEmail,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error removing member");
        }

        handleClose();
      } catch (error) {
        console.error("Error:", error.message);
        setIsSubmitting(false);
      }
    }
  };

  const handleEmailChange = (newEmail) => {
    setSelectedEmail(newEmail);
    const selectedMember = emails.find((member) => member.email === newEmail);
    if (selectedMember) {
      const profile = selectedMember.profile;
      setIdPerfilPro(
        profile === 1 ? "Medical Assistance" : 
        profile === 2 ? "Member" : 
        profile === 3 ? "Only Read" : 
        ""
      );
    } else {
      setIdPerfilPro("");
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
        Edit Member
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Edit Member</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can "Edit Member Profile" or "Remove Member" from your appointment
          </DialogContentText>
        </DialogContent>

        <Box sx={{ display: "flex", justifyContent: "center", marginRight: 2 }}>
          <ButtonGroup variant="text" aria-label="Basic button group">
            <Button onClick={() => setAction("Edit")}>Edit</Button>
            <Button onClick={() => setAction("Delete")}>Delete</Button>
          </ButtonGroup>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", marginRight: 2 }}>
          <ControllableStates
            value={selectedEmail}
            onChange={handleEmailChange}
            options={emails.map((member) => member.email)}
            labelName={"Email Member"}
          />
        </Box>

        {action === "Edit" && (
          <React.Fragment>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginRight: 2,
                marginTop: 2,
              }}
            >
              <ControllableStates
                value={idPerfilPro}
                onChange={() => {}}
                options={[]}
                labelName={"Current Profile"}
                readOnly={true}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginRight: 2,
                marginTop: 2,
              }}
            >
              <ControllableStates
                value={profile}
                onChange={setProfile}
                options={profileOptions}
                labelName={"Next Profile"}
              />
            </Box>
          </React.Fragment>
        )}

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : action === "Edit" ? "Update" : "Remove"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default EditMemberDialog;
