import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./TrendingMovies.scss";
import "./Home.scss";

const apiKey = "14af83f372fe18ca097a8721d92b7145";
const imgUrl = "https://image.tmdb.org/t/p/original";

const TrendingMovies = () => {
  const [movies, setMovies] = useState([]);
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
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&page=${page}`
        );
        const res = response.data.results.filter(
          (item) => item.poster_path !== null
        );
        setMovies((prev) =>
          [...prev, ...res].filter(
            (item, index, self) =>
              index === self.findIndex((m) => m.id === item.id)
          )
        ); // Append new movies
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchMovies();
  }, [page]);

  return (
    <div className="trending-movies">
      <h2>Trending Movies</h2>
      <div className="all-movies">
        {movies.map((item, index) => (
          <Link
            to={`/home/movies/${item.id}`}
            key={index}
            className="poster-item"
          >
            <img src={`${imgUrl}/${item.poster_path}`} alt={item.title} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingMovies;
