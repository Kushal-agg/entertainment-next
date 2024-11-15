import React, { useEffect, useState, useRef } from "react";
import "./Home.scss";
import MovieDialog from "./MoviesPage";
import axios from "axios";
import { BiPlay } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import Footer from "./Footer";
import Row from "./Row";
import Banner from "./banner";
import { co } from "language-name-map/map";

const apiKey = "14af83f372fe18ca097a8721d92b7145";
const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&include_video=true`;
const imgUrl = "https://image.tmdb.org/t/p/original";

const Movies = () => {
  const [upComing, setUpComing] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRated, setTopRated] = useState([]);

  const [upComingPage, setUpComingPage] = useState(1);
  const [nowPlayingPage, setNowPlayingPage] = useState(1);
  const [popularPage, setPopularPage] = useState(1);
  const [topRatedPage, setTopRatedPage] = useState(1);

  const today = new Date();

  const curr = today.toISOString().split("T")[0]; // Format as YYYY-MM-DD

  const prev = new Date(today);
  prev.setDate(today.getDate() - 30);
  const latest = prev.toISOString().split("T")[0];

  useEffect(() => {
    const fetchUpcoming = async () => {
      const response = await axios.get(
        `${url}&sort_by=popularity.desc&with_origin_country=IN&with_release_type=3|2&primary_release_date.gte=${curr}&page=${upComingPage}`
      );
      const res = response.data.results.filter(
        (item) => item.poster_path !== null
      );
      setUpComing((prev) =>
        [...prev, ...res].filter(
          (item, index, self) =>
            index === self.findIndex((m) => m.id === item.id)
        )
      );
    };
    fetchUpcoming();
  }, [upComingPage]);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      const response = await axios.get(
        `${url}&sort_by=popularity.desc&with_origin_country=IN|US&with_release_type=3|2&primary_release_date.gte=${latest}&primary_release_date.lte=${curr}&page=${nowPlayingPage}`
      );
      const res = response.data.results.filter(
        (item) => item.poster_path !== null
      );
      setNowPlaying((prev) =>
        [...prev, ...res].filter(
          (item, index, self) =>
            index === self.findIndex((m) => m.id === item.id)
        )
      );
    };
    fetchNowPlaying();
  }, [nowPlayingPage]);

  useEffect(() => {
    const fetchPopular = async () => {
      const response = await axios.get(
        `${url}&sort_by=popularity.desc&vote_average.gte=7&with_origin_country=IN|US&primary_release_date.lte=${curr}&page=${popularPage}`
      );
      const res = response.data.results.filter(
        (item) => item.poster_path !== null
      );
      setPopularMovies((prev) =>
        [...prev, ...res].filter(
          (item, index, self) =>
            index === self.findIndex((m) => m.id === item.id)
        )
      );
    };
    fetchPopular();
  }, [popularPage]);

  useEffect(() => {
    const fetchTopRated = async () => {
      const response = await axios.get(
        `${url}&sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200&with_origin_country=IN&primary_release_date.lte=${curr}&page=${topRatedPage}`
      );
      const res = response.data.results.filter(
        (item) => item.poster_path !== null
      );
      setTopRated((prev) =>
        [...prev, ...res].filter(
          (item, index, self) =>
            index === self.findIndex((m) => m.id === item.id)
        )
      );
    };
    fetchTopRated();
  }, [topRatedPage]);

  const umovie = [...nowPlaying, ...popularMovies, ...topRated, ...upComing]
    .filter((item) => item.poster_path !== null)
    .filter(
      (movie, index, self) => index === self.findIndex((m) => m.id === movie.id)
    );

  return (
    <section>
      <Banner items={umovie} />

      <Row
        title={"Upcoming"}
        arr={upComing}
        nav={"/movies"}
        onScrollEnd={() => setUpComingPage((page) => page + 1)}
      />
      <Row
        title={"Now Playing"}
        arr={nowPlaying}
        nav={"/movies"}
        onScrollEnd={() => setNowPlayingPage((page) => page + 1)}
      />
      <Row
        title={"Popular Movies"}
        arr={popularMovies}
        nav={"/movies"}
        onScrollEnd={() => setPopularPage((page) => page + 1)}
      />
      <Row
        title={"Top Rated"}
        arr={topRated}
        nav={"/movies"}
        onScrollEnd={() => setTopRatedPage((page) => page + 1)}
      />

      <Footer />
    </section>
  );
};

export default Movies;
