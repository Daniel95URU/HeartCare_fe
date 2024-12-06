import React, { useState } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MainContent from "../MainContent/MainContent";
import CalendarProject from "../CalendarProject";
import citaIcon from "../assetsHome/cita.png";
import historialIcon from "../assetsHome/historialIcon.png";
import examenesIcon from "../assetsHome/examenesIcon.png";
import tratamientosIcon from "../assetsHome/tratamientosIcon.png";
import hospitalizacionIcon from "../assetsHome/hospitalizacionIcon.png";
import calendarIcon from "../assetsHome/calendar-days.png";
import confiIcon from "../assetsHome/configuraciones.png";

const drawerWidth = 200;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "#16dbf5",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function SideBar({ userEmail, userId, personId, profileUser }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("Project");

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const customIcons = [citaIcon, calendarIcon, hospitalizacionIcon, confiIcon];

  const renderComponent = () => {
    switch (selectedComponent) {
      case "Project":
        return <MainContent userEmail={userEmail} userId={userId} personId={personId} />;
      case "Calendario":
        return <CalendarProject />;
      default:
        return console.log("Nada de momento...")
    }
  };

  const menuItems = [
    { text: "Citas", icon: citaIcon },
    { text: "Calendario", icon: calendarIcon },
    { text: "Examenes", icon: examenesIcon },
    { text: "Historia Medica", icon: historialIcon },
    { text: "Tratamientos", icon: tratamientosIcon },
  ];

  if (profileUser === 1) {
    menuItems.push({ text: "contacto cliente", icon: confiIcon });
    menuItems.push({ text: "Hospitalizacion", icon: hospitalizacionIcon });
   
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Box component="img" src="../../../completeLogo.png" alt="" sx={{ width: 40, height: 40 }} />
            <Typography variant="h6" component="div" sx={{ ml: 2, fontFamily: "Roboto, sans-serif" }}>
              MediCare
            </Typography>
          </Box>
          <Typography variant="subtitle1" sx={{ fontFamily: "Roboto, sans-serif" }}>
            {userEmail}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((item, index) => (
            <ListItem key={item.text} disablePadding sx={{ display: "block" }} onClick={() => setSelectedComponent(item.text)}>
              <ListItemButton
                sx={{
                  minHeight: 89,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <Box component="img" src={item.icon} alt={`${item.text} Icon`} sx={{ width: 24, height: 24 }} />
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: 10,
          marginLeft: "auto",
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
          maxWidth: "80%",
        }}
      >
        <DrawerHeader />
        {renderComponent()}
      </Box>
    </Box>
  );
}
