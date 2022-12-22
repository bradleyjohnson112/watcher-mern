import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../App";
import { AiOutlineSearch, AiOutlineMenu } from "react-icons/ai";
import { Navigate, useLocation } from 'react-router-dom';
import Show from "./show";
import styles from "./watchlist.module.css";

const Watchlist = () => {
  const [shows, setShows] = useState([]);
  const token = useContext(AuthContext);

  useEffect(() => {
    const getShows = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/shows", {
          method: "GET",
          headers: {
            "x-access-token": token,
          },
        });
  
        if (!res.ok) return alert(`${res.status} ${res.statusText}`);
  
        const usersShows = await res.json();

        if (!usersShows.length > 0) return;

        searchShows(usersShows);
      } catch (err) {
        alert(err);
      }
    }
    getShows();
  }, []);

  const searchShows = (usersShows) => {
    const requests = [];
    usersShows.forEach((show) => {
      const url = `https://api.tvmaze.com/shows/${show.apiId}?embed[]=previousepisode&embed[]=nextepisode`;
      requests.push(fetch(url));
    })

    Promise.all(requests)
    .then(res => Promise.all(res.map(r => r.json())))
    .then(shows => {
      setShows(shows);
    });
  }

  const location = useLocation();

  const deleteShow = async (title) => {
    try {
      const res = await fetch(`http://localhost:5000/api/shows/delete/${title}`, {
        method: "DELETE",
        headers: {
          "x-access-token": token,
        },
      });
  
      if (!res.ok) return alert(`${res.status} ${res.statusText}`);
  
      const newShows = shows.filter((show) => show.name !== title);
      setShows(newShows || []);
    } catch (err) {
      alert(err);
    }
  }

  // authorizing route
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className={styles.section}>
      <div className={styles.sectionContent}>
        {shows.length > 0
        ? (
          <ul>
            {shows.map((show) => {
              return <Show 
              key={show.id} 
              deleteShow={deleteShow}
              show={show}
              styles={styles}
              />
            })}
          </ul>
        )
        : <p>
            Your shows are empty. Click the menu 
            <span>{<AiOutlineMenu />}</span> 
            then go to the search 
            <span>{<AiOutlineSearch />}</span>
            tab to add some!
          </p>
        }
      </div>
    </section>
  )
}

export default Watchlist;