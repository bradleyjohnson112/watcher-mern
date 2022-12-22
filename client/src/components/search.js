import React, { useContext, useState } from "react";
import { AuthContext } from "../App";
import { Navigate, useLocation } from 'react-router-dom';
import styles from "./search.module.css";
import { AiOutlineSearch, AiOutlinePlus, AiOutlineCheck } from "react-icons/ai";

const Search = () => {
  const [query, setQuery] = useState("");
  const [shows, setShows] = useState([]);

  const token = useContext(AuthContext);
  const location = useLocation();

  // authorizing route
  if (!token) {
    return <Navigate to="/" replace state={{ from: location }}/>;
  }

  const onSubmit = async (e) => {
    try {
      e.preventDefault();

      const url = `https://api.tvmaze.com/search/shows?q=${query}`;
      const res = await fetch(url);

      if (!res.ok) return alert(`${res.status} ${res.statusText}`);
      const data = await res.json();
  
      const temp = data.map(obj => {
        return {
          title: obj.show.name,
          apiId: obj.show.id,
          added: false,
        }
      });
  
      setQuery("");
      setShows(temp);
    } catch (err) {
      alert(err);
    }
  }

  function onChange(e) {
    setQuery(e.target.value);
  }

  function handleAdded(id) {
    setShows(prevState => 
      prevState.map(show => {
        if (show.apiId === id) {
          return {
            ...show,
            added: !show.added,
          }
        }
        return show;
      })  
    )
  };

  async function createShow(e, show) {
    try {
      const json = { title: show.title, apiId: show.apiId };
      const res = await fetch("http://localhost:5000/api/shows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(json),
      });

      if (!res.ok) return alert(`${res.status} ${res.statusText}`);
  
      handleAdded(show.apiId);
    } catch (err) {
      alert(err);
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.sectionContent}>
        <form className={styles.searchForm} onSubmit={onSubmit}>
          <input 
            type="text"
            placeholder="Search show..."
            value={query}
            onChange={onChange}
          />
          <button>
            <AiOutlineSearch className={styles.searchFormIcon} />
          </button>
        </form>
        <ul>
          {shows.map(show => (
            <li key={show.apiId}>
              <span>{show.title}</span>
              <button onClick={(e) => createShow(e, show)} disabled={show.added}>
                {show.added ?
                  <AiOutlineCheck className={styles.addIcon} disabled={true}/>
                :
                  <AiOutlinePlus className={styles.addIcon}/>
                }
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Search;