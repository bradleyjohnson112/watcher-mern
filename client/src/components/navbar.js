import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AiOutlineHome, AiOutlineSearch, AiOutlineUser, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { AuthContext, UserContext } from "../App";
import cx from "classnames";
import styles from "./navbar.module.css";

const Navbar = ({ onLogout }) => {
  const [toggle, setToggle] = useState(false);

  function handleToggle() {
    setToggle(!toggle);
  }

  const token = useContext(AuthContext);
  const user = useContext(UserContext);

  return (
    <>
    {token ? 
        (<>
        <header className={styles.header}>
          <div className={ cx(styles.navLink, styles.sidebarOpenBtn) } onClick={handleToggle}>
            <AiOutlineMenu className={styles.navIcon}/>
          </div>
          <NavLink to="/profile" className={styles.navLink}>
            <span className={styles.headerUsername}>{user.username}</span>
            <AiOutlineUser className={cx(styles.navIcon, styles.headerUser)}/>
          </NavLink>
        </header>
        <Sidebar 
          style={{ transform: toggle ? "translateX(0)" : "translateX(-100%)" }}
          handleToggle={handleToggle}
        />
        </>)
      : 
        (<header className={styles.landingHeader}>
          <NavLink to="/" className={styles.navLink}>
            <span className={styles.headerLogo}>Watcher.</span>
          </NavLink>
          <div className={styles.headerRight}>
            <NavLink to="/register" className={styles.navLink}>
              Register
            </NavLink>
            <NavLink to="/login" className={styles.navLink}>
              Sign In
            </NavLink>
          </div>
        </header>)
    }
    </>
  )
}

const Sidebar = ({ style, handleToggle }) => {
  return (
    <nav className={styles.sidebar} style={style}>
      <ul>
        <li>
          <div className={cx(styles.navLink, styles.sidebarCloseBtn)} onClick={handleToggle}>
            <AiOutlineClose className={styles.navIcon}/>
          </div>
        </li>
        <li>
          <NavLink to="/" className={styles.navLink}>
            <AiOutlineHome className={styles.navIcon}/>
          </NavLink>
        </li>
        <li>
            <NavLink to="/search" className={styles.navLink}>
              <AiOutlineSearch className={styles.navIcon}/>
            </NavLink>
        </li>
        <li>
            <NavLink to="/profile" className={styles.navLink}>
              <AiOutlineUser />
            </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar;