import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./login.module.css";

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  })
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h3>Sign In</h3>
        <form onSubmit={(e) => onLogin(e, form)}>
          <div className={styles.formGroup}>
            <input 
              type="text"
              placeholder="Username"
              value={form.username}
              name="username"
              onChange={onChange}
            />
          </div>
          <div className={styles.formGroup}>
            <input 
              type="password"
              placeholder="Password"
              value={form.password}
              name="password"
              onChange={onChange}
            />
          </div>
          <input 
            type="submit"
            value="Next"
          />
        </form>
      </div>
    </section>
  )
}

export default Login;