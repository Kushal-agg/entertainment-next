import axios from "axios";
import Link from "next/link";
import Banner from "~/components/banner";

const API_KEY = "14af83f372fe18ca097a8721d92b7145";
const BASE_URL = "https://api.themoviedb.org/3";
const imgUrl = "https://image.tmdb.org/t/p/original";

interface Movie {
  id: number;
  poster_path: string;
}

const fetchMovies = async (endpoint: string, params: object) => {
  const response = await axios.get(`${BASE_URL}/${endpoint}`, {
    params: { api_key: API_KEY, ...params },
  });

  return response.data.results.filter(
    (item: Movie) => item.poster_path !== null
  );
};

const Movies = async () => {
  const today = new Date();
  const curr = today.toISOString().split("T")[0];
  const prev = new Date(today);
  prev.setDate(today.getDate() - 30);
  const latest = prev.toISOString().split("T")[0];

  const [upComing, nowPlaying, popularMovies, topRated] = await Promise.all([
    fetchMovies("discover/movie", {
      sort_by: "popularity.desc",
      with_origin_country: "IN",
      with_release_type: "3|2",
      "primary_release_date.gte": curr,
      page: 1,
    }),
    fetchMovies("discover/movie", {
      sort_by: "popularity.desc",
      with_origin_country: "IN|US",
      with_release_type: "3|2",
      "primary_release_date.gte": latest,
      "primary_release_date.lte": curr,
      page: 1,
    }),
    fetchMovies("discover/movie", {
      sort_by: "popularity.desc",
      "vote_average.gte": 7,
      with_origin_country: "IN|US",
      "primary_release_date.lte": curr,
      page: 1,
    }),
    fetchMovies("discover/movie", {
      sort_by: "vote_average.desc",
      without_genres: "99,10755",
      "vote_count.gte": 200,
      with_origin_country: "IN",
      "primary_release_date.lte": curr,
      page: 1,
    }),
  ]);

  const renderRow = (title: string, movies: Movie[], nav: string) => (
    <div className="p-4 bg-gray-900">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-extrabold text-white">{title}</h2>
        <Link href={`/movie/${title.split(" ").join("-")}`}>View All</Link>
      </div>

      <div className="flex overflow-x-auto space-x-2 pb-2 relative scroll-smooth">
        {movies.map((item) => (
          <Link
            href={`${nav}/${item.id}`}
            key={item.id}
            className="flex-none relative m-2 p-1 transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-md"
          >
            <img
              className="w-36 h-48 rounded-lg object-cover cursor-pointer"
              src={`${imgUrl}/${item.poster_path}`}
              alt={item.id.toString()}
            />
          </Link>
        ))}
      </div>
    </div>
  );

  const umovie = [...nowPlaying, ...popularMovies, ...topRated, ...upComing]
    .filter((item) => item.poster_path !== null)
    .filter(
      (movie, index, self) => index === self.findIndex((m) => m.id === movie.id)
    );

  return (
    <section className="bg-gray-900 text-white min-h-screen">
      <Banner items={umovie} />
      <div className="px-5 space-y-10">
        {renderRow("Upcoming", upComing, "/movie")}
        {renderRow("Now Playing", nowPlaying, "/movie")}
        {renderRow("Popular Movies", popularMovies, "/movie")}
        {renderRow("Top Rated", topRated, "/movie")}
      </div>
    </section>
  );
};

export default Movies;
