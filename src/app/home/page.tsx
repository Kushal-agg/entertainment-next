import React from "react";
import Link from "next/link";
import Banner from "~/components/banner"; // Ensure the path to Banner is correct
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Define the Media interface
interface Media {
  id: number;
  title: string;
  poster_path: string;
}

// API key and image URL
const apiKey = "14af83f372fe18ca097a8721d92b7145";
const imgUrl = "https://image.tmdb.org/t/p/original";

// Server-side fetch function inside the component
const Home = async () => {
  // Get random page number for fetching the movies and TV shows
  const page = Math.floor(Math.random() * 10) + 1;

  // Fetch movies and TV shows data from API
  const fetchData = async (type: string) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/trending/${type}/day?api_key=${apiKey}&include_adult=false&page=${page}`
    );
    const data = await response.json();
    return data.results.filter((item: Media) => item.poster_path !== null);
  };

  const [movies, tv] = await Promise.all([fetchData("movie"), fetchData("tv")]);

  // Limit the results to 5 for display
  const displayedMovies = movies.slice(0, 10);
  const displayedTv = tv.slice(0, 10);

  return (
    <div className="text-white bg-[#141414]">
      <Banner items={[...displayedMovies, ...displayedTv]} />
      {/* Trending Movies Section */}
      <section className="mt-4">
        <div className="w-full p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white text-xl md:text-2xl">
              Trending Movies
            </h2>
            <Link
              href="/home/trendingmovies"
              className="text-blue-500 mr-20 hover:underline text-sm md:text-base"
            >
              View All
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 py-2 items-start">
            {displayedMovies.length === 0 ? (
              <Skeleton count={5} height={300} width={200} />
            ) : (
              displayedMovies.map((item: Media) => (
                <Link
                  href={`/movie/${item.id}`}
                  key={item.id}
                  className="flex-none w-[120px] sm:w-[150px] md:w-[200px] lg:w-[220px] rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
                >
                  <img
                    src={`${imgUrl}/${item.poster_path}`}
                    alt={item.title}
                    className="w-full h-auto object-cover"
                  />
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
      {/* Trending TV Shows Section */}
      <section className="mt-4">
        <div className="w-full p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white text-xl md:text-2xl">
              Trending TV Shows
            </h2>
            <Link
              href="/home/trendingshows"
              className="text-blue-500 mr-20 hover:underline text-sm md:text-base"
            >
              View All
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 py-2 items-start">
            {displayedTv.length === 0 ? (
              <Skeleton count={5} height={300} width={200} />
            ) : (
              displayedTv.map((item: Media) => (
                <Link
                  href={`/tv/${item.id}`}
                  key={item.id}
                  className="flex-none w-[120px] sm:w-[150px] md:w-[200px] lg:w-[220px] rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
                >
                  <img
                    src={`${imgUrl}/${item.poster_path}`}
                    alt={item.title}
                    className="w-full h-auto object-cover"
                  />
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
