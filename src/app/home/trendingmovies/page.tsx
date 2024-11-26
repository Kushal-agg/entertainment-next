// pages/trending-movies.tsx

import { Suspense } from "react";
import Link from "next/link";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const API_KEY = "14af83f372fe18ca097a8721d92b7145";
const BASE_URL = "https://api.themoviedb.org/3";
const imgUrl = "https://image.tmdb.org/t/p/original";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
}

interface Props {
  searchParams: { page?: string };
}

const fetchMovies = async (
  page: number
): Promise<{ movies: Movie[]; totalPages: number }> => {
  const response = await axios.get(`${BASE_URL}/trending/movie/day`, {
    params: {
      api_key: API_KEY,
      page,
    },
  });

  const movies = response.data.results
    .filter((item: any) => item.poster_path !== null)
    .map((item: any) => ({
      id: item.id,
      title: item.title,
      poster_path: item.poster_path,
    }));

  return { movies, totalPages: response.data.total_pages };
};

const MovieList = async ({ page }: { page: number }) => {
  const { movies, totalPages } = await fetchMovies(page);

  const generatePageNumbers = () => {
    const maxVisible = 5; // Number of visible page links
    const pages = [];
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(page - half, 1);
    let end = Math.min(page + half, totalPages);

    if (start === 1) {
      end = Math.min(maxVisible, totalPages);
    } else if (end === totalPages) {
      start = Math.max(totalPages - maxVisible + 1, 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <>
      <div className="flex flex-wrap justify-center gap-4">
        {movies.map((item) => (
          <Link
            href={`/movie/${item.id}`}
            key={item.id}
            className="w-36 sm:w-48 md:w-60 lg:w-72"
          >
            <img
              src={`${imgUrl}/${item.poster_path}`}
              alt={item.title}
              className="w-full h-auto rounded-md shadow-lg transition-transform transform hover:scale-105"
            />
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-8">
        {page > 1 && (
          <Link
            href={`?page=${page - 1}`}
            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
          >
            &laquo;
          </Link>
        )}
        {pageNumbers.map((p) => (
          <Link
            href={`?page=${p}`}
            key={p}
            className={`px-3 py-1 rounded-md ${
              p === page
                ? "bg-blue-600 text-white font-bold"
                : "bg-gray-700 text-white hover:bg-blue-500"
            } transition`}
          >
            {p}
          </Link>
        ))}
        {page < totalPages && (
          <Link
            href={`?page=${page + 1}`}
            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
          >
            &raquo;
          </Link>
        )}
      </div>
    </>
  );
};

const SkeletonLoader = () => {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="w-36 sm:w-48 md:w-60 lg:w-72 h-60 bg-gray-700 rounded-md animate-pulse"
        >
          <Skeleton height={240} width="100%" />
        </div>
      ))}
    </div>
  );
};

const TrendingMovies: React.FC<Props> = async ({ searchParams }) => {
  const currentPage = parseInt(searchParams.page || "1", 10);

  return (
    <div className="bg-gray-900 min-h-screen p-5">
      <h2 className="text-white text-2xl font-semibold mb-5">
        Trending Movies
      </h2>
      <Suspense fallback={<SkeletonLoader />}>
        <MovieList page={currentPage} />
      </Suspense>
    </div>
  );
};

export default TrendingMovies;