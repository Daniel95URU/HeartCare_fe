import React from "react";
import SideBar from "../HomeComponent/SideBar/SideBar";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const Home = ({ userEmail, userId, personId, profileUser}) => {
  return (
    <div>
      <SideBar userEmail={userEmail} userId={userId} personId={personId} profileUser={profileUser}/>
    </div>
  );
};

export default Home;