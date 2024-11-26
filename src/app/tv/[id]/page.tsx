import axios from "axios";
import { getLangNameFromCode } from "language-name-map";

const imgUrl = "https://image.tmdb.org/t/p/original";
const apiKey = "14af83f372fe18ca097a8721d92b7145";

// Types
interface CastMember {
  id: number;
  name: string;
  profile_path: string;
}

interface Review {
  id: string;
  content: string;
}

interface TvDetails {
  name: string;
  original_name: string;
  poster_path: string;
  first_air_date: string;
  vote_average: number;
  original_language: string;
  status: string;
  genres: { name: string }[];
  tagline: string;
  overview: string;
  created_by: { id: number; name: string }[];
  production_companies: { id: number; logo_path: string }[];
  networks: { id: number; logo_path: string }[];
}

// Server-Rendered Component
const TvPage = async ({ params }: { params: { id: string } }) => {
  const id = params.id;

  // Fetch TV Details
  const tvDetails = await axios.get<TvDetails>(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`
  );

  const tv = tvDetails.data;

  // Fetch Trailer
  const trailerData = await axios.get(
    `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${apiKey}`
  );
  const youtubeTrailer = trailerData.data.results.find(
    (video: { site: string; type: string }) =>
      video.site === "YouTube" && video.type === "Trailer"
  );

  const trailer = youtubeTrailer
    ? `https://www.youtube.com/embed/${youtubeTrailer.key}`
    : null;

  // Fetch Cast
  const castData = await axios.get<{ cast: CastMember[] }>(
    `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${apiKey}`
  );
  const cast = castData.data.cast.filter(
    (member: CastMember) => member.profile_path !== null
  );

  // Fetch Reviews
  const reviewsData = await axios.get<{ results: Review[] }>(
    `https://api.themoviedb.org/3/tv/${id}/reviews?api_key=${apiKey}`
  );
  const reviews = reviewsData.data.results;

  const tvGenres = tv.genres.map((genre) => genre.name) || [];
  const languageName = tv.original_language
    ? getLangNameFromCode(tv.original_language)?.name || "NA"
    : "NA";

  return (
    <div className="bg-gray-800 text-white min-h-screen px-5 py-10">
      <div className="flex gap-10 mb-10">
        <div className="flex-shrink-0 w-80">
          <img
            className="w-full h-auto rounded-lg shadow-lg"
            src={`${imgUrl}/${tv.poster_path}`}
            alt={tv.name}
          />
        </div>
        <div className="flex-grow flex flex-col">
          <h2 className="text-4xl font-bold mb-3">
            {tv.name}
            {tv.name !== tv.original_name && tv.original_name && (
              <span className="ml-2 text-lg text-gray-400">
                {tv.original_name}
              </span>
            )}
          </h2>
          <div className="flex flex-wrap gap-2 mb-5">
            {tvGenres.map((genre, index) => (
              <span
                key={index}
                className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm"
              >
                {genre}
              </span>
            ))}
          </div>
          <p className="text-lg mb-5 italic">{tv.tagline}</p>
          <p className="mb-5">{tv.overview}</p>
          {tv.created_by && tv.created_by.length > 0 && (
            <p className="text-lg mb-5">
              <strong>Created By: </strong>
              {tv.created_by.map((creator, index) => (
                <span key={creator.id}>
                  <strong>{creator.name}</strong>
                  {index < tv.created_by.length - 1 && ", "}
                </span>
              ))}
            </p>
          )}
          {trailer && (
            <div className="mt-5">
              <iframe
                width="100%"
                height="315"
                src={trailer}
                title="TV Trailer"
                frameBorder="0"
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
            {cast.map((member) => (
              <div
                key={member.id}
                className="flex-none w-44 text-center p-1 rounded-lg shadow-xl "
              >
                <img
                  className="w-44 h-40 object-fill rounded-md mb-3"
                  src={`${imgUrl}/${member.profile_path}`}
                  alt={member.name}
                />
                <p className="text-sm font-medium text-white">{member.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-3">Reviews</h3>
          <div className="flex flex-row pb-2 overflow-x-auto gap-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex-none h-32 w-96 mb-2 bg-gray-700 p-2 rounded-lg shadow-md overflow-auto scrollbar-hide"
              >
                <p className="text-gray-300 text-sm">{review.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TvPage;
function notFound() {
  throw new Error("Function not implemented.");
}
