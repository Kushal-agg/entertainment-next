import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getLangNameFromCode } from "language-name-map";
import { useLocation, useParams } from "react-router-dom";
import "./Modal.scss";

const imgUrl = "https://image.tmdb.org/t/p/original";
const apiKey = "14af83f372fe18ca097a8721d92b7145";

const MoviesPage = ({ arr = [] }) => {
  const { id } = useParams();
  const [movie, setMovie] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [cast, setCast] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [dir, setDir] = useState([]);

  const reviewRef = useRef(null);

  const handleScroll = () => {
    if (reviewRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = reviewRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        setPage((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    const curr = reviewRef.current;
    if (curr) {
      curr.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (curr) {
        curr.removeEventListener("scroll", handleScroll);
      }
    };
  }, [reviewRef.current]);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
        );
        setMovie(data);
      } catch (error) {
        console.error("Failed to fetch movie:", error);
      }
    };
    fetchMovie();
  }, []);
  useEffect(() => {
    const fetchTrailer = async () => {
      if (!movie) return;

      try {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`
        );

        const youtubeTrailer = data.results.find(
          (video) => video.site === "YouTube" && video.type === "Trailer"
        );

        if (youtubeTrailer) {
          setTrailer(`https://www.youtube.com/embed/${youtubeTrailer.key}`);
        }
      } catch (error) {
        console.error("Failed to fetch movie trailer:", error);
      }
    };

    const fetchCast = async () => {
      if (!movie) return;

      try {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`
        );
        // Filter cast members who belong to the acting department and have a profile path
        const filteredCast = data.cast.filter(
          (member) =>
            member.known_for_department === "Acting" && member.profile_path
        );
        setCast(filteredCast);
        const directors = data.crew.filter(
          (member) => member.job === "Director"
        );
        setDir(directors);
      } catch (error) {
        console.error("Failed to fetch cast information:", error);
      }
    };

    fetchTrailer();
    fetchCast();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!movie) return;
      try {
        console.log("Fetching reviews for page:", page);
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${apiKey}&page=${page}`
        );
        setReviews((prev) =>
          [...prev, ...data.results].filter(
            (item, index, self) =>
              index === self.findIndex((m) => m.id === item.id)
          )
        );
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };
    fetchReviews();
  }, [page]);

  if (!movie) return null;

  const movieGenres = movie.genres
    ? movie.genres.map((genre) => genre.name)
    : [];

  const languageName =
    getLangNameFromCode(movie.original_language)?.name || "N/A";

  const parseContent = (content) => {
    const modifiedContent = content.replace(
      /<a href="([^"]+)">([^<]+)<\/a>/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$2</a>'
    );

    // Process blockquotes for ">"
    const blockquoteContent = modifiedContent.replace(
      /^>\s*(.*)/gm,
      "<blockquote>$1</blockquote>"
    );

    // Format bold, italic sentences, handle Score/Verdict, and ensure proper line breaks
    const formattedContent = blockquoteContent
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Convert **text** to <strong> (bold)
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // Convert *text* to <em> (italic)
      .replace(/_(.*?)_/g, "<em>$1</em>") // Convert _text_ to <em> (italic)
      .replace(/\s*\|\s*/g, "<br />") // Convert pipe | to line break
      .replace(/(Score:)/g, "<br /><strong>$1</strong>") // Ensure line break and bold before "Score:"
      .replace(/(Verdict:)/g, "<br /><strong>$1</strong>") // Ensure line break and bold before "Verdict:"
      .replace(/(Final rating:)/g, "<br /><strong>$1</strong>") // Ensure line break and bold before "Final rating:"
      .replace(/(Rating:)/g, "<br /><strong>$1</strong>") // Ensure line break and bold before "Rating:"
      .replace(/(GRADE:)/g, "<br /><strong>$1</strong>") // Ensure line break and bold before "GRADE:"

      // Ensure ratings and verdicts like "Score: 8/10" or "Verdict: Excellent" are italicized and have line breaks after them
      .replace(
        /(Score:\s*)(\d+(\.\d+)?\/\d+)/g,
        "<strong>$1</strong><em>$2</em><br />"
      ) // Italicize rating numbers after "Score:"
      .replace(/(Verdict:\s*)(.*)/g, "<strong>$1</strong><em>$2</em><br />") // Italicize verdict after "Verdict:"

      // Handle other numerical ratings, ensuring line breaks after ratings
      .replace(/(?<=:\s*)(\d+(\.\d+)?\/\d+)/g, "<em>$1</em><br />");

    return formattedContent;
  };

  return (
    <div className="movie-page">
      <div className="main-content">
        <div className="poster-container">
          <img
            className="dialog-poster"
            src={`${imgUrl}/${movie.poster_path}`}
            alt={movie.title}
          />
          <div className="movie-info">
            <p>
              <strong>Release Date:</strong>{" "}
              {new Date(movie.release_date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p>
              <strong>Rating:</strong>{" "}
              {movie.vote_average
                ? `${movie.vote_average.toFixed(1)} / 10.0`
                : "N/A"}
            </p>
            <p>
              <strong>Language:</strong> {languageName}
            </p>
            <p style={{ marginBottom: "0px" }}>
              <strong>Revenue:</strong>{" "}
              {movie.revenue
                ? `$${(movie.revenue / 1_000_000).toFixed(2)} million`
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="content-container">
          <h2>
            {movie.title}
            {movie.original_title && movie.original_title !== movie.title && (
              <span
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "normal",
                  color: "#ccc", // A lighter color for the original title
                  marginLeft: "5px", // Space between titles
                }}
              >
                {movie.original_title}
              </span>
            )}
          </h2>
          <div className="genre-list">
            {movieGenres.map((genre, index) => (
              <span key={index} className="genre-tag">
                {genre}
              </span>
            ))}
            {movie.runtime ? <span style={{ padding: "5px 0px" }}>•</span> : ""}
            {movie.runtime ? (
              <span style={{ padding: "5px 0px" }}>
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </span>
            ) : (
              ""
            )}
          </div>
          <p>{movie.overview}</p>
          {dir && dir.length > 0 && (
            <p style={{ margin: "0px" }}>
              <em>Directed By</em>:{" "}
              {dir.map((director, index) => (
                <strong key={director.id}>
                  {director.name}
                  {index < dir.length - 1 && ", "}
                </strong>
              ))}
            </p>
          )}
          {trailer && (
            <div className="trailer-container">
              <iframe
                width="100%"
                height="315"
                src={trailer}
                title="Movie Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      </div>

      {cast.length > 0 && (
        <div className="cast-section">
          <h3>Top Cast</h3>
          <div className="cast-list">
            {cast.map((member) => (
              <div className="cast-member" key={member.id}>
                <img
                  src={`${imgUrl}/${member.profile_path}`}
                  alt={member.name}
                />
                <p>{member.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="review-section">
          <h3>Reviews</h3>
          <div className="review-list" ref={reviewRef}>
            {reviews.map((item) => (
              <div className="review-item" key={item.id}>
                <p
                  dangerouslySetInnerHTML={{
                    __html: parseContent(item.content),
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {movie.production_companies && movie.production_companies.length > 0 && (
        <div className="production-section" style={{ marginBottom: "5px" }}>
          <h3 className="production-title">Production Companies</h3>
          <div className="production-list">
            {movie.production_companies.map(
              (company) =>
                company.logo_path && (
                  <div className="company" key={company.id}>
                    <img
                      src={`${imgUrl}/${company.logo_path}`}
                      alt={company.name}
                      className="company-logo"
                    />
                  </div>
                )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviesPage;
