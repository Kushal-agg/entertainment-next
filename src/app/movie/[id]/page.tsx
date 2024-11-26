import { Suspense } from "react";
import axios from "axios";
import { getLangNameFromCode } from "language-name-map";
import { notFound } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const imgUrl = "https://image.tmdb.org/t/p/original";
const apiKey = "14af83f372fe18ca097a8721d92b7145";

interface Movie {
  id: number;
  title: string;
  original_title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  original_language: string;
  revenue: number;
  overview: string;
  genres: { id: number; name: string }[];
  runtime: number;
  production_companies: { id: number; name: string; logo_path: string }[];
}

// Fetch Movie Data
async function getMovie(id: string) {
  try {
    const { data } = await axios.get<Movie>(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
    );
    return data;
  } catch (error) {
    return null;
  }
}

// Fetch Trailer
async function getTrailer(id: string) {
  try {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`
    );
    const youtubeTrailer = data.results.find(
      (video: any) => video.site === "YouTube" && video.type === "Trailer"
    );
    return youtubeTrailer
      ? `https://www.youtube.com/embed/${youtubeTrailer.key}`
      : null;
  } catch (error) {
    return null;
  }
}

// Fetch Cast and Directors
async function getCastAndDirectors(id: string) {
  try {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`
    );
    const cast = data.cast.filter(
      (member: any) =>
        member.known_for_department === "Acting" && member.profile_path
    );
    const directors = data.crew.filter(
      (member: any) => member.job === "Director"
    );
    return { cast, directors };
  } catch (error) {
    return { cast: [], directors: [] };
  }
}

// Fetch Reviews
async function getReviews(id: string) {
  try {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${apiKey}&page=1`
    );
    return data.results;
  } catch (error) {
    return [];
  }
}

// Movie Information Component
const MovieInfo: React.FC<{ id: string }> = async ({ id }) => {
  const [movie, trailer, { cast, directors }, reviews] = await Promise.all([
    getMovie(id),
    getTrailer(id),
    getCastAndDirectors(id),
    getReviews(id),
  ]);

  if (!movie) {
    notFound();
  }

  const production = movie.production_companies.filter(
    (company) => company.logo_path
  );

  const movieGenres = movie.genres.map((genre) => genre.name);
  const languageName =
    getLangNameFromCode(movie.original_language)?.name || "N/A";

  return (
    <div className="bg-gray-800 text-white min-h-screen p-4 sm:p-6 md:p-8 lg:p-10">
      {/* Movie Details Section */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-shrink-0 w-full sm:w-72">
          <img
            className="w-full h-auto mb-3 rounded-xl shadow-lg"
            src={`${imgUrl}/${movie.poster_path}`}
            alt={movie.title}
          />
          <div className="text-gray-400 space-y-2">
            <p>
              <strong className="text-yellow-400">Release Date:</strong>{" "}
              {new Date(movie.release_date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p>
              <strong className="text-yellow-400">Rating:</strong>{" "}
              {movie.vote_average
                ? `${movie.vote_average.toFixed(1)} / 10`
                : "N/A"}
            </p>
            <p>
              <strong className="text-yellow-400">Language:</strong>{" "}
              {languageName}
            </p>
            <p>
              <strong className="text-yellow-400">Revenue:</strong>{" "}
              {movie.revenue
                ? `$${(movie.revenue / 1_000_000).toFixed(2)} million`
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="flex-grow">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{movie.title}</h2>
          <div className="flex flex-wrap gap-3 mb-5">
            {movieGenres.map((genre, index) => (
              <span
                key={index}
                className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-full text-sm shadow-md"
              >
                {genre}
              </span>
            ))}
            {movie.runtime > 0 && (
              <span className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-full text-sm">
                {`${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`}
              </span>
            )}
          </div>
          <p className="text-sm sm:text-base mb-5">{movie.overview}</p>
          {directors.length > 0 && (
            <p className="text-sm sm:text-base">
              Directed By:{" "}
              {directors.map(
                (director: { id: number; name: string }, index: number) => (
                  <strong key={director.id} className="text-yellow-400">
                    {director.name}
                    {index < directors.length - 1 && ", "}
                  </strong>
                )
              )}
            </p>
          )}
          {trailer && (
            <div className="mt-8 rounded-xl shadow-lg overflow-hidden">
              <iframe
                width="100%"
                height="315"
                src={trailer}
                title="Movie Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      </div>

      {cast.length > 0 && (
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-5">Top Cast</h3>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {cast.map(
              (member: { profile_path: string; name: string; id: number }) => (
                <div
                  key={member.id}
                  className="flex-none w-44 text-center p-1 rounded-lg shadow-xl"
                >
                  <img
                    className="w-44 h-40 object-fill rounded-md mb-3"
                    src={`${imgUrl}/${member.profile_path}`}
                    alt={member.name}
                  />
                  <p className="text-sm font-medium text-white">
                    {member.name}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-3">Reviews</h3>
          <div className="flex flex-row pb-2 overflow-x-auto gap-4">
            {reviews.map((review: { id: number; content: string }) => (
              <div
                key={review.id}
                className="flex-none h-40 w-96 mb-2 bg-gray-700 p-2 rounded-lg shadow-md overflow-auto  scrollbar-hide "
              >
                <p className="text-gray-300 text-sm">{review.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Production Companies */}
      {production.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold mb-3">Production Companies</h3>
          <div className="flex gap-8 items-center flex-wrap">
            {production.map((company) => (
              <div key={company.id} className="flex flex-col items-center">
                {company.logo_path && (
                  <img
                    className="w-20 h-20 object-contain"
                    src={`${imgUrl}/${company.logo_path}`}
                    alt={company.name}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SkeletonLoader = () => (
  <div className="p-6 space-y-6">
    <Skeleton height={400} />
    <Skeleton count={3} />
    <Skeleton height={200} />
  </div>
);

const Page: React.FC<{ params: { id: string } }> = ({ params }) => {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <MovieInfo id={params.id} />
    </Suspense>
  );
};

export default Page;
