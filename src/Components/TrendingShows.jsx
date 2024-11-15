import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./TrendingMovies.scss";
import "./Home.scss";
import TvDialogBox from "./TvPage";

const apiKey = "14af83f372fe18ca097a8721d92b7145";
const imgUrl = "https://image.tmdb.org/t/p/original";

const TrendingShows = () => {
  const [shows, setShows] = useState([]);
  const [page, setPage] = useState(1);

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 10
    ) {
      setPage((prev) => prev + 1);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}&page=${page}`
        );
        const res = response.data.results.filter(
          (item) => item.poster_path !== null
        );
        setShows((prev) =>
          [...prev, ...res].filter(
            (item, index, self) =>
              index === self.findIndex((m) => m.id === item.id)
          )
        ); // Append new shows
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchShows();
  }, [page]);

  return (
    <div className="trending-movies">
      <h2>Trending TV Shows</h2>
      <div className="all-movies">
        {shows.map((item, index) => (
          <Link
            to={`/home/tvshows/${item.id}`}
            key={index}
            className="poster-item"
          >
            <img src={`${imgUrl}/${item.poster_path}`} alt={item.name} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingShows;
