import React from "react";

const Episode = ({ episode, isNext, styles }) => {
  function formatDateTime(date) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const dateTime = new Date(date);
    const dateString = `${dateTime.getUTCDate()} ${
      months[dateTime.getUTCMonth()]
    } ${dateTime.getUTCFullYear()} ${
      dateTime.getUTCHours() < 10
        ? "0" + dateTime.getUTCHours()
        : dateTime.getUTCHours()
    }:${
      dateTime.getUTCMinutes() < 10
        ? "0" + dateTime.getUTCMinutes()
        : dateTime.getUTCMinutes()
    }`;
    return dateString;
  }
  
  return (
    <div className={styles.episode}>
      <span className={styles.episodeName}>
        {isNext 
          ? `Next Episode: ${episode.name}` 
          : `Previous Episode: ${episode.name}`
        }
      </span>
      <span className={styles.episodeDate}>Airdate: {formatDateTime(episode.airstamp)}</span>
    </div>
  );
}

const Show = ({ show, deleteShow, styles }) => {
  return (
    <li key={show.id} className={styles.show}>
      <div className={styles.showBackground} style={{
        backgroundImage: `url(${
          show.image.original ?
          show.image.original :
          null
        })`,
      }}>
      </div>
      <div className={styles.showOverlay}></div>
      <div className={styles.showContent}>
        <h3>{show.name}</h3>
        <div className={styles.status}>
          <span>Status: </span> 
          <span style={{ color: show.status === "Running" ? "green" : "red" }}>{show.status === "Running" ? "RUNNING" : "ENDED"}</span> 
        </div>
        {show?._embedded
        ? show._embedded?.nextepisode
          ? <Episode episode={show._embedded.nextepisode} isNext={true} styles={styles} />
          : <Episode episode={show._embedded.previousepisode} isNext={false} styles={styles} />
        : <div className={styles.episode}>
            Episode information unavaliable
          </div>
        }
        <button onClick={() => deleteShow(show.name)}>Remove</button>
      </div>
    </li>
  );
}

export default Show;