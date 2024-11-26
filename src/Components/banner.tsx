"use client";
import React, { useRef, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import "./banner.scss";

const imgUrl = "https://image.tmdb.org/t/p/original";

const Banner = ({ items }: { items: { poster_path: string }[] }) => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    centerMode: true,
    centerPadding: "200px", // Original padding
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 768, // For tablets
        settings: {
          centerPadding: "100px", // Adjust padding for smaller screens
        },
      },
      {
        breakpoint: 480, // For mobile devices
        settings: {
          centerPadding: "50px", // Adjust padding for mobile screens
        },
      },
    ],
  };

  const ref = useRef<HTMLDivElement | null>(null);
  const sliderRef = useRef<Slider | null>(null);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (ref.current && ref.current.contains(event.target as Node)) {
        event.preventDefault();
        if (event.deltaX > 20) {
          sliderRef.current?.slickNext(); // Move to next slide
        } else if (event.deltaX < -20) {
          sliderRef.current?.slickPrev(); // Move to previous slide
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
        onClick={() => sliderRef.current?.slickPrev()}
      />
      <SlArrowRight
        className="right-arrow"
        onClick={() => sliderRef.current?.slickNext()}
      />
      <Slider {...settings} ref={sliderRef}>
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
