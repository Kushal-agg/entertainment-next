import axios from "axios";
import Link from "next/link";
import Banner from "~/components/banner";
import { BiPlay } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import "react-loading-skeleton/dist/skeleton.css";

const API_KEY = "14af83f372fe18ca097a8721d92b7145";
const BASE_URL = "https://api.themoviedb.org/3";
const imgUrl = "https://image.tmdb.org/t/p/original";

interface TVShow {
  id: number;
  poster_path: string;
  genre_ids: number[];
}

// Utility function to fetch data
const fetchTVShows = async (
  endpoint: string,
  params: object
): Promise<TVShow[]> => {
  const response = await axios.get(`${BASE_URL}/${endpoint}`, {
    params: { api_key: API_KEY, ...params },
  });

  return response.data.results.filter(
    (item: TVShow) => item.poster_path !== null && item.genre_ids.length > 0
  );
};

const TVShows = async () => {
  const today = new Date();
  const curr = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD

  const prev = new Date(today);
  prev.setFullYear(today.getFullYear() - 2);
  const latest = prev.toISOString().split("T")[0]; // Two years ago

  // Fetch all TV show categories in parallel
  const [arrivingToday, onTheAir, popular, topRated] = await Promise.all([
    fetchTVShows("discover/tv", {
      sort_by: "popularity.desc",
      "vote_average.gte": 6,
      with_origin_country: "IN",
      "first_air_date.gte": latest,
      "first_air_date.lte": curr,
      page: 1,
    }),
    fetchTVShows("discover/tv", {
      sort_by: "popularity.desc",
      with_origin_country: "IN|US",
      "with_runtime.gte": 30,
      page: 1,
    }),
    fetchTVShows("discover/tv", {
      sort_by: "popularity.desc",
      vote_average_gte: 7,
      with_origin_country: "IN|US|GB|KR",
      first_air_date_lte: curr,
      page: 1,
    }),
    fetchTVShows("discover/tv", {
      sort_by: "popularity.desc",
      "vote_average.gte": 8,
      "vote_average.lte": 10,
      with_origin_country: "IN",
      "first_air_date.lte": curr,
      page: 1,
    }),
  ]);

  const renderRow = (title: string, shows: TVShow[], nav: string) => (
    <div className="p-4 bg-gray-900">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-extrabold text-white">{title}</h2>
        <Link href={`/tv/${title.split(" ").join("-")}`}>View All</Link>
      </div>

      <div className="flex overflow-x-auto space-x-2 pb-2 relative scroll-smooth">
        {shows.map((item) => (
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

  const allShows = [
    ...arrivingToday,
    ...onTheAir,
    ...popular,
    ...topRated,
  ].filter(
    (item, index, self) => index === self.findIndex((m) => m.id === item.id)
  );

  return (
    <section className="bg-gray-900 text-white min-h-screen">
      <Banner items={allShows} />

      <div className="px-5 space-y-10">
        {renderRow("Airing Today", arrivingToday, "/tv")}
        {renderRow("On The Air", onTheAir, "/tv")}
        {renderRow("Popular", popular, "/tv")}
        {renderRow("Top Rated", topRated, "/tv")}
      </div>
    </section>
  );
};

export default TVShows;
