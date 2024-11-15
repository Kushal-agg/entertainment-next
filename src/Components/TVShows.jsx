import React, { useEffect, useRef, useState } from "react";
import "./Home.scss";
import TvDialogBox from "./TvPage";
import axios from "axios";
import { Link } from "react-router-dom";
import { BiPlay, BiWindows } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import Footer from "./Footer";
import Row from "./Row";
import Banner from "./banner";

const apiKey = "14af83f372fe18ca097a8721d92b7145";
const url = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&include_adult=false&include_video=true`;
const imgUrl = "https://image.tmdb.org/t/p/original";

const TVShows = () => {
  const [arrivingToday, setArrivingToday] = useState([]);
  const [arrivingTodayPage, setArrivingTodayPage] = useState(1);

  const [onTheAir, setOnTheAir] = useState([]);
  const [onTheAirPage, setOnTheAirPage] = useState(1);

  const [popular, setPopular] = useState([]);
  const [popularPage, setPopularPage] = useState(1);

  const [topRated, setTopRated] = useState([]);
  const [topRatedPage, setTopRatedPage] = useState(1);

  const today = new Date();

  const curr = today.toISOString().split("T")[0]; // Format as YYYY-MM-DD

  const prev = new Date(today);
  prev.setFullYear(today.getFullYear() - 2);
  const latest = prev.toISOString().split("T")[0];
  console.log(latest);

  useEffect(() => {
    const fetchArrivingToday = async () => {
      const response = await axios.get(
        `${url}&sort_by=popularity.desc&vote_average.gte=6&with_origin_country=IN&first_air_date.gte=${latest}&first_air_date.lte=${curr}&page=${arrivingTodayPage}`
      );
      const filteredResults = response.data.results.filter(
        (item) => item.poster_path !== null && item.genre_ids.length > 0
      );
      setArrivingToday((prev) =>
        [...prev, ...filteredResults].filter(
          (item, index, self) =>
            index === self.findIndex((m) => m.id === item.id)
        )
      );
    };
    fetchArrivingToday();
  }, [arrivingTodayPage]);

  useEffect(() => {
    const fetchOnTheAir = async () => {
      const response = await axios.get(
        `${url}&sort_by=popularity.desc&with_origin_country=IN|US&with_runtime.gte=30&page=${onTheAirPage}`
      );
      const filteredResults = response.data.results.filter(
        (item) => item.poster_path !== null && item.genre_ids.length > 0
      );
      setOnTheAir((prev) =>
        [...prev, ...filteredResults].filter(
          (item, index, self) =>
            index === self.findIndex((m) => m.id === item.id)
        )
      );
    };
    fetchOnTheAir();
  }, [onTheAirPage]);

  useEffect(() => {
    const fetchPolpular = async () => {
      const response = await axios.get(
        `${url}}&sort_by=popularity.desc&vote_average.gte=7&with_origin_country=IN|US|GB|KR&first_air_date.lte=${curr}&page=${popularPage}`
      );
      const filteredResults = response.data.results.filter(
        (item) => item.poster_path !== null && item.genre_ids.length > 0
      );
      setPopular((prev) =>
        [...prev, ...filteredResults].filter(
          (item, index, self) =>
            index === self.findIndex((m) => m.id === item.id)
        )
      );
    };
    fetchPolpular();
  }, [popularPage]);

  useEffect(() => {
    const fetchTopRated = async () => {
      const response = await axios.get(
        `${url}&sort_by=popularity.desc&vote_average.gte=8&vote_average.lte=10&with_origin_country=IN&first_air_date.lte=${curr}&page=${topRatedPage}`
      );
      const filteredResults = response.data.results.filter(
        (item) => item.poster_path !== null && item.genre_ids.length > 0
      );
      setTopRated((prev) =>
        [...prev, ...filteredResults].filter(
          (item, index, self) =>
            index === self.findIndex((m) => m.id === item.id)
        )
      );
    };
    fetchTopRated();
  }, [topRatedPage]);

  const utv = [...arrivingToday, ...onTheAir, ...popular, ...topRated]
    .filter((item) => item.poster_path !== null)
    .filter(
      (item, index, self) => index === self.findIndex((m) => m.id === item.id)
    );
  return (
    <section>
      <Banner items={utv} />
      <Row
        title={"Airing Today"}
        arr={arrivingToday}
        nav={"/tvshows"}
        onScrollEnd={() => setArrivingTodayPage((page) => page + 1)}
      />
      <Row
        title={"On The Air"}
        arr={onTheAir}
        nav={"/tvshows"}
        onScrollEnd={() => setOnTheAirPage((page) => page + 1)}
      />
      <Row
        title={"Polpular"}
        arr={popular}
        nav={"/tvshows"}
        onScrollEnd={() => setPopularPage((page) => page + 1)}
      />
      <Row
        title={"Top Rated"}
        arr={topRated}
        nav={"/tvshows"}
        onScrollEnd={() => setTopRatedPage((page) => page + 1)}
      />

      <Footer />
    </section>
  );
};

export default TVShows;
