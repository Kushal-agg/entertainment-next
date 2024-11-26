import axios from "axios";
import Link from "next/link";

const API_KEY = "14af83f372fe18ca097a8721d92b7145";
const BASE_URL = "https://api.themoviedb.org/3";
const imgUrl = "https://image.tmdb.org/t/p/original";

interface TVShow {
  id: number;
  title: string;
  poster_path: string;
}
const fetchOnTheAir = async (page: number) => {
  const response = await axios.get(`${BASE_URL}/discover/tv`, {
    params: {
      api_key: API_KEY,
      sort_by: "popularity.desc",
      with_origin_country: "IN|US",
      "with_runtime.gte": 30,
      page,
    },
  });
  return response.data;
};

export default async function OnTheAir({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || "1", 10);
  const data = await fetchOnTheAir(page);
  const shows: TVShow[] = data.results;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-5">
      <h1 className="text-2xl font-bold mb-5">On The Air</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {shows.map((show) => (
          <Link
            href={`/tv/${show.id}`}
            key={show.id}
            className="block overflow-hidden rounded-lg shadow-md hover:scale-105 transition-transform"
          >
            <img
              src={`${imgUrl}/${show.poster_path}`}
              alt={show.title}
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
