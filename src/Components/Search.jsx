import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import MovieDialog from "./MoviesPage";
import TvDialogBox from "./TvPage";
import "./searchRes.scss";

const apiKey = "14af83f372fe18ca097a8721d92b7145";
const url = "https://api.themoviedb.org/3";
const imgUrl = "https://image.tmdb.org/t/p/original";

const Column = ({ arr = [] }) => {
  return (
    <div className="column">
      <div className="column-content">
        {arr.map((item, index) => {
          const imgPath = item.poster_path || item.profile_path;
          const imgSrc = imgPath ? `${imgUrl}${imgPath}` : null;
          const nav =
            item.media_type == "movie" ? "/search/movies" : "/search/tvshows";
          return (
            <Link to={`${nav}/${item.id}`} key={index} className="cards">
              {imgSrc && (
                <img
                  src={imgSrc}
                  alt={item.title || item.name}
                  className="cards-img"
                />
              )}
              <div className="cards-info">
                <h3 className="cards-title">{item.title || item.name}</h3>
                {item.release_date && (
                  <p className="cards-release">
                    {new Date(item.release_date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                )}
                {item.first_air_date && (
                  <p className="cards-release">
                    {new Date(item.first_air_date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                )}
                {item.overview && (
                  <p className="cards-overview">{item.overview}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = location.state?.searchTerm || "";
  const [searchTerm, setSearchTerm] = useState(query);
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 5) {
      setPage((prev) => prev + 1);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    navigate(location.pathname, {
      state: { searchTerm: e.target.value },
      replace: true,
    });
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        setPage(1);
        return;
      }
      try {
        const res = await axios.get(
          `${url}/search/multi?api_key=${apiKey}&query=${searchTerm}&include_adult=false`
        );
        const filteredResults = res.data.results
          .filter(
            (item) => item.media_type !== "person" && item.poster_path !== null
          )
          .filter(
            (item, index, self) =>
              index === self.findIndex((m) => m.id === item.id)
          );

        setSearchResults(filteredResults);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };
    fetchSearchResults();
  }, [searchTerm]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const res = await axios.get(
          `${url}/search/multi?api_key=${apiKey}&query=${searchTerm}&include_adult=false&page=${page}`
        );
        const filteredResults = res.data.results.filter(
          (item) => item.media_type !== "person" && item.poster_path !== null
        );

        setSearchResults((prev) =>
          [...prev, ...filteredResults].filter(
            (item, index, self) =>
              index === self.findIndex((m) => m.id === item.id)
          )
        );
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };
    fetchSearchResults();
  }, [page]);

  return (
    <div className="search-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search movies or shows..."
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button className="search-icon">
          <CiSearch />
        </button>
      </div>
      {searchResults.length > 0 && (
        <div className="results-container">
          <Column arr={searchResults} />
        </div>
      )}
    </div>
  );
};

export default Search;
