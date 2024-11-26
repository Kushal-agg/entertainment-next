"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation"; // Import useSearchParams hook
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const API_KEY = "14af83f372fe18ca097a8721d92b7145";
const BASE_URL = "https://api.themoviedb.org/3";
const imgUrl = "https://image.tmdb.org/t/p/original";

interface SearchResult {
  id: number;
  title: string;
  name: string;
  media_type: string;
  poster_path: string | null;
  release_date: string | null;
  first_air_date: string | null;
  overview: string | null;
}

const Search: React.FC = () => {
  const searchParams = useSearchParams(); // Hook to access query parameters
  const searchTerm = searchParams.get("searchTerm") || ""; // Get "searchTerm" query param
  const [search, setSearch] = useState<string>(searchTerm);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  // Fetch search results
  const fetchSearchResults = async (search: string, pageNumber: number) => {
    if (!searchTerm.trim()) return;

    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/search/multi`, {
        params: {
          api_key: API_KEY,
          query: search,
          page: pageNumber,
          include_adult: false,
        },
      });

      const newResults = response.data.results.filter(
        (item: any) => item.media_type !== "person" && item.poster_path !== null
      );

      setResults((prev) =>
        [...prev, ...newResults].filter(
          (item, index, self) =>
            index === self.findIndex((m) => m.id === item.id)
        )
      );
      setHasMore(newResults.length > 0); // If no new results, stop loading more
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Use effect for infinite scroll
  useEffect(() => {
    if (!searchTerm.trim()) return;

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    observer.current = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "100px",
      threshold: 1.0,
    });

    if (lastElementRef.current) {
      observer.current.observe(lastElementRef.current);
    }

    return () => {
      if (observer.current && lastElementRef.current) {
        observer.current.unobserve(lastElementRef.current);
      }
    };
  }, [lastElementRef, hasMore, isLoading]);

  useEffect(() => {
    setSearch(searchTerm);
    setResults([]);
    setPage(1);
    setIsLoading(true);
    setHasMore(false);
    fetchSearchResults(searchTerm, 1);
  }, [searchTerm]);

  useEffect(() => {
    fetchSearchResults(search, page);
  }, [page]);

  return (
    <div className="bg-gray-900 min-h-screen p-5">
      <h2 className="text-white text-2xl font-semibold mb-5">
        Search Results for "{searchTerm}"
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.map((item, index) => (
          <Link
            href={`/${item.media_type}/${item.id}`}
            key={item.id}
            className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:translate-y-[-5px] hover:shadow-lg"
          >
            <img
              src={`${imgUrl}/${item.poster_path}`}
              alt={item.title || item.name}
              className="w-full h-56 object-fill"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-blue-600">
                {item.title || item.name}
              </h3>
              {(item.release_date || item.first_air_date) && (
                <p className="text-sm text-gray-600">
                  {new Date(
                    item.release_date || item.first_air_date!
                  ).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
              {item.overview && (
                <p className="text-sm text-gray-500 mt-2 truncate">
                  {item.overview}
                </p>
              )}
            </div>
          </Link>
        ))}
        {/* Skeleton loader for loading more results */}
        {isLoading &&
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="h-65 bg-slate-700 rounded-md animate-pulse shadow-md"
            >
              <Skeleton height={240} width="100%" />
            </div>
          ))}
        <div ref={lastElementRef}></div>
      </div>
    </div>
  );
};

export default Search;
