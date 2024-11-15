import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Row.scss";

const imgUrl = "https://image.tmdb.org/t/p/original";

const Row = ({ title, arr, nav, onScrollEnd }) => {
  const rowRef = useRef(null);
  let isScrolling;

  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = rowRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        // Add buffer
        if (!isScrolling) {
          isScrolling = setTimeout(() => {
            onScrollEnd();
            isScrolling = null; // Reset scroll debounce
          }, 200); // Debounce the scroll event by 200ms
        }
      }
    }
  };

  useEffect(() => {
    const curr = rowRef.current;
    if (curr) {
      curr.addEventListener("scroll", handleScroll);
      console.log("added event listener");
    }
    return () => {
      if (curr) {
        curr.removeEventListener("scroll", handleScroll);
        console.log("removed event listener");
      }
    };
  }, [rowRef.current]);

  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row-content" ref={rowRef}>
        {arr.map((item, index) => {
          return (
            <Link
              to={`${nav}/${item.id}`}
              className="card-container"
              key={index}
            >
              <img
                className="card"
                src={`${imgUrl}/${item.poster_path}`}
                alt="cover"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Row;
