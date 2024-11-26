import axios from "axios";
import Link from "next/link";

const API_KEY = "14af83f372fe18ca097a8721d92b7145";
const BASE_URL = "https://api.themoviedb.org/3";
const imgUrl = "https://image.tmdb.org/t/p/original";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

const fetchMovies = async (page: number) => {
  const today = new Date();
  const curr = today.toISOString().split("T")[0];
  const prev = new Date(today);
  prev.setDate(today.getDate() - 30);
  const latest = prev.toISOString().split("T")[0];

  const response = await axios.get(`${BASE_URL}/discover/movie`, {
    params: {
      api_key: API_KEY,
      with_origin_country: "IN",
      with_release_type: "3|2",
      "primary_release_date.gte": latest,
      "primary_release_date.lte": curr,
      page,
    },
  });
  return response.data;
};

export default async function NowPlayingMovies({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || "1", 10);
  const data = await fetchMovies(page);
  const movies: Movie[] = data.results;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-5">
      <h1 className="text-2xl font-bold mb-5">Now Playing Movies</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <Link
            href={`/movie/${movie.id}`}
            key={movie.id}
            className="block overflow-hidden rounded-lg shadow-md hover:scale-105 transition-transform"
          >
            <img
              src={`${imgUrl}/${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-72 object-fill"
            />
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-8">
        {page > 1 && (
          <Link
            href={`?page=${page - 1}`}
            className="bg-blue-500 px-3 py-1 rounded text-white hover:bg-blue-600"
          >
            Previous
          </Link>
        )}
        <span className="text-gray-300 px-3 py-1">{page}</span>
        {page < data.total_pages && (
          <Link
            href={`?page=${page + 1}`}
            className="bg-blue-500 px-3 py-1 rounded text-white hover:bg-blue-600"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
