import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./register.module.css";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    try {
      e.preventDefault();

      const user = { ...form };
  
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user)
      });
      
      if (!res.ok) {
        const msg = await res.text();
        return alert(`${msg}`);
      }
  
      navigate("/login");
    } catch (err) {
      alert(err);
    }
  }

  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h3>Register</h3>
        <form onSubmit={onSubmit}>
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
            type="email"
            placeholder="Email"
            value={form.email}
            name="email"
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
        <div className={styles.formGroup}>
          <input 
            type="password"
            placeholder="Confirm Password"
            value={form.confirm}
            name="confirm"
            onChange={onChange}
          />
        </div>
        <input 
          type="submit"
          value="Register"
        />
        </form>
      </div>
    </section>
  )
}

export default Register;