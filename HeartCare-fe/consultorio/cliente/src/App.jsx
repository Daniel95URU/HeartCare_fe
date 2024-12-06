// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import './App.css';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Home from './Components/Home/Home';
import Loader from './Components/Loader/Loader';
import { registerLicense } from '@syncfusion/ej2-base'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [personId, setPersonId] = useState("");
  const [profileId, setProfileId] = useState("");
  registerLicense('Ngo9BigBOggjHTQxAR8/V1NDaF5cWWtCf1FpRGdGfV5ycEVEallWTndWUiweQnxTdEFiWH5acHJRRGNZU0F2Xw');

  const handleLogin = (email, id, idPerson, profileId) => {
    setUserEmail(email);
    setUserId(id);
    setPersonId(idPerson)
    setProfileId(profileId)
    setIsAuthenticated(true);
    setIsLoading(true); // Muestra el Loader antes de mostrar Home
  };

  console.log(profileId)

  const handleVideoEnd = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true); // Muestra el Loader al montar el componente App
  }, []);

  return (
    <div className="app-container">
      {isLoading ? (
        <Loader onVideoEnd={handleVideoEnd} />
      ) : (
        isAuthenticated ? <Home userEmail={userEmail} userId={userId} personId={personId} profileUser={profileId}/> : <LoginSignup onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;


