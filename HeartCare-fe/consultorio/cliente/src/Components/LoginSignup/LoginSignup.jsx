import React, { useState } from "react";
import style from "./LoginSignup.module.css";
import user_icon from "../assets/person.png";
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";
import logo from "../assets/completeLogo.png";
import background from "../assets/fondo.png";

const LoginSignup = ({ onLogin }) => {
  const [action, setAction] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState("");
  const [passwordRecoveryEmail, setPasswordRecoveryEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    } else {
      setEmailError("");
    }

    // Validación de contraseña
    if (password.length < 8) {
      setPasswordError("The password must have at least 8 characters");
      return;
    } else {
      setPasswordError("");
    }

    const url =
      action === "Login"
        ? "http://localhost:3000/login"
        : "http://localhost:3000/signup";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: name,
          correo_per: email,
          password_usu: password,
        }),
      });
      const data = await response.json();
      console.log(data);

      const emailPersona = email;
      console.log(emailPersona);
      const personIden= data.personId;
      console.log(personIden)
      const permisosMapa = data.permissions;
      const firstKey = Object.keys(permisosMapa)[0];
      const splitpermiso = firstKey.split('_');
      const idUserMap = splitpermiso[3];
      console.log(idUserMap);

      // Manejo de errores
      if (!response.ok) {
        throw new Error(data.message || "Failed to perform action");
      }

      setMessage(data.message || "Action successful");
      if (action === "Login") {
        onLogin(emailPersona, idUserMap, personIden, data.profileUser);
      }
    } catch (error) {
      setMessage(error.message || "An error occurred");
    }
  };

  const handleSubmitPasswordRecovery = async (e) => {
    e.preventDefault();

    // Validación de correo electrónico para recuperación de contraseña
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(passwordRecoveryEmail)) {
      setMessage("Please enter a valid email address for password recovery");
      return;
    }

    // Aquí realizarías la solicitud POST para solicitar recuperación de contraseña
    const url = "http://localhost:3000/recover-password";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo_per: passwordRecoveryEmail,
        }),
      });
      const data = await response.json();
      console.log(data);

      // Manejo de errores
      if (!response.ok) {
        throw new Error(data.message || "Failed to request password recovery");
      }

      setMessage(data.message || "Password recovery email sent");
    } catch (error) {
      setMessage(error.message || "An error occurred while requesting password recovery");
    }
  };

  return (
    <div
      className={style["background-container"]}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className={style["inner-container"]}>
        <div className={style.container}>
          <div className={style.header}>
            <img src={logo} alt="Logo" className={style.logo} />
            <h2 className={style.text}>{action}</h2>
            <div className={style.underline}></div>
          </div>
          {message && <div className={style.message}>{message}</div>}
          <form onSubmit={handleSubmit}>
            {action === "Signup" && (
              <div className={style.inputs}>
                <div className={style.inputAnima}>
                  <div className={style.input}>
                    <img src={user_icon} alt="user" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <label>Username</label>
                  </div>
                </div>
              </div>
            )}
            <div className={style.inputs}>
              <div className={style.inputAnima}>
                <div className={style.input}>
                  <img src={email_icon} alt="email" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label>Email</label>
                </div>
                {emailError && <div className={style.error}>{emailError}</div>}
              </div>
            </div>
            <div className={style.inputs}>
              <div className={style.inputAnima}>
                <div className={style.input}>
                  <img src={password_icon} alt="password" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label>Password</label>
                </div>
                {passwordError && (
                  <div className={style.error}>{passwordError}</div>
                )}
              </div>
            </div>
            {action === "Login" && (
              <div className={style.forgotPassword}>
                <span
                  onClick={() =>
                    setAction((prev) =>
                      prev === "Login" ? "RecoverPassword" : "Login"
                    )
                  }
                >
                  Forgot password?
                </span>
              </div>
            )}
            {action === "RecoverPassword" && (
              <div className={style.inputs}>
                <div className={style.inputAnima}>
                  <div className={style.input}>
                    <img src={email_icon} alt="email" />
                    <input
                      type="email"
                      value={passwordRecoveryEmail}
                      onChange={(e) => setPasswordRecoveryEmail(e.target.value)}
                      required
                    />
                    <label>Email for password recovery</label>
                  </div>
                </div>
                <div className={style.forgotPassword}>
                  <span
                    onClick={() => setAction("Login")}
                  >
                    Back to login
                  </span>
                </div>
              </div>
            )}
            <button type="submit" className={style.submit}>
              {action}
            </button>
          </form>
          <div className={style.switchContainer}>
            <div className={style.switchText}>
              {action === "Login"
                ? "Don't have an account?"
                : "Already have an account?"}
              <span
                className={style.switchLink}
                onClick={() =>
                  setAction((prev) => (prev === "Login" ? "Signup" : "Login"))
                }
              >
                {action === "Login" ? "Sign Up" : "Log In"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
