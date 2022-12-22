import React, { useState } from "react";
import styles from "./home.module.css";
import homeImg from "./homeImg.svg";

const Home = ({ onLogin }) => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  })

  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <>
    <section className={styles.section}>
      <div className={styles.overlay}></div>
      <div className={styles.backgroundImg}></div>
      <div className={styles.sectionContent}>
        <h1>Keep up to date with your favourite shows</h1>
        <form className={styles.homeForm} onSubmit={(e) => onLogin(e, form)}>
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
            value="Sign In"
          />
        </form>
      </div>
    </section>
    </>
  )
}

export default Home;