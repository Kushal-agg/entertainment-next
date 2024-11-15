"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import Banner from "./banner";
import Footer from "./Footer";
import { BiLinkExternal } from "react-icons/bi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { fetchTrendingMovies, fetchTrendingTVShows } from "~/actions/getMovies";

const imgUrl = "https://image.tmdb.org/t/p/original";

const Home = () => {
  const [movies, setMovie] = useState([]);
  const [tv, setTv] = useState([]);
  const [loading, setLoading] = useState(true);
  const page = Math.floor(Math.random() * 10) + 1;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [movieData, tvData] = await Promise.all([
          fetchTrendingMovies(page),
          fetchTrendingTVShows(page)
        ]);
        
        setMovie(movieData);
        setTv(tvData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);
  const uniqueItems = [...movies, ...tv];

  return (
    <div className="home-page">
      <Banner items={uniqueItems} />
      <section className="recommended-section" style={{ marginTop: "10px" }}>
        <div className="recommended">
          <div className="view">
            <h2>Trending Movies</h2>
          </div>
          <div className="scrollable-row">
            {movies.map((item, index) => (
              <Link
                href={`/home/movies/${item.id}`}
                key={index}
                className="poster-item"
              >
                {/* Next.js recommended Image component could be used here */}
                <img src={`${imgUrl}/${item.poster_path}`} alt={item.title} />
              </Link>
            ))}
            <div className="view-all">
              <Link href="/home/trendingmovies">
                <div className="icon-container">
                  <BiLinkExternal className="icon" />
                  <span className="overlay-text">View All</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="recommended-section">
        <div className="recommended">
          <div className="view">
            <h2>Trending TV Shows</h2>
          </div>
          <div className="scrollable-row">
            {tv.map((item, index) => (
              <Link
                href={`/home/tvshows/${item.id}`}
                key={index}
                className="poster-item"
              >
                <img src={`${imgUrl}/${item.poster_path}`} alt={item.title} />
              </Link>
            ))}
            <div className="view-all">
              <Link href="/home/trendingshows">
                <div className="icon-container">
                  <BiLinkExternal className="icon" />
                  <span className="overlay-text">View All</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
