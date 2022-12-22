import React, { useContext } from "react";
import { AuthContext, UserContext } from "../App";
import { Navigate, useLocation } from 'react-router-dom';
import styles from "./profile.module.css"

const Profile = ({ handleLogout, deleteUser }) => {
  const token = useContext(AuthContext);
  const user = useContext(UserContext);
  const location = useLocation();

  // authorizing route
  if (!token) {
    return <Navigate to="/" replace state={{ from: location }}/>;
  }

  return (
    <section className={styles.section}>
      <div className={styles.sectionContent}>
        <button onClick={handleLogout} className={styles.logoutBtn}>Sign Out</button>
        <button onClick={deleteUser} className={styles.deleteUserBtn}>Delete account</button>
      </div>
    </section>
  )
}

export default Profile;