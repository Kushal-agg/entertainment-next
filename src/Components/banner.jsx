import React, { useRef, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";
import "./bannerStyles.scss";

const imgUrl = "https://image.tmdb.org/t/p/original";

const Banner = ({ items }) => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    centerMode: true,
    centerPadding: "200px",
    pauseOnHover: true,
  };

  const ref = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    const handleWheel = (event) => {
      if (ref.current && ref.current.contains(event.target)) {
        event.preventDefault();

        if (event.deltaX > 30) {
          sliderRef.current.slickNext(); // Move to next slide
        } else if (event.deltaX < -30) {
          sliderRef.current.slickPrev(); // Move to previous slide
        }
      }
    };

    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <section className="slider" ref={ref}>
      <SlArrowLeft
        className="left-arrow"
        onClick={() => sliderRef.current.slickPrev()}
      />

      <SlArrowRight
        className="right-arrow"
        onClick={() => sliderRef.current.slickNext()}
      />

      <Slider {...settings} ref={sliderRef} className="slider">
        {items.map((item, index) => (
          <div key={index} className="slide-item">
            <img src={`${imgUrl}${item.poster_path}`} alt="cover" />
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default Banner;
