"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const apiKey = "14af83f372fe18ca097a8721d92b7145";
const url = "https://api.themoviedb.org/3";

const SearchInput: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchTermFromURL = searchParams.get("searchTerm") || "";

  const [search, setSearch] = useState(searchTermFromURL); // Initialize search state with searchTerm query param
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const dropdownRef = useRef<HTMLUListElement>(null);
  const highlightedRef = useRef<HTMLLIElement>(null);

  // Synchronize `search` state with `searchTerm` query parameter
  useEffect(() => {
    setSearch(searchTermFromURL); // Update search state whenever `searchTerm` changes in the URL
    setSuggestions([]); // Clear suggestions when the search term changes
  }, [searchTermFromURL]);

  // Fetch suggestions when the search input changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search === "" || search === searchTermFromURL) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await axios.get(
          `${url}/search/multi?api_key=${apiKey}&query=${search}&include_adult=false`
        );
        const filteredResults = res.data.results.filter(
          (item: any) => item.media_type !== "person"
        );
        setSuggestions(
          filteredResults.filter(
            (item: any, index: number, self: any[]) =>
              index === self.findIndex((m) => m.id === item.id)
          )
        );
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    fetchSuggestions();
  }, [search]);

  // Handle clicks outside the dropdown to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: any) => {
    setSuggestions([]);
    setHighlightedIndex(-1);
    router.push(`/search?searchTerm=${suggestion.name || suggestion.title}`);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleSuggestionClick(suggestions[highlightedIndex]);
      } else if (highlightedIndex === -1 || suggestions.length === 0) {
        router.push(`/search?searchTerm=${search}`);
      }
    }
  };

  // Ensure the highlighted suggestion is visible
  useEffect(() => {
    if (highlightedRef.current) {
      highlightedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightedIndex]);

  return (
    <div className="relative flex items-center">
      <input
        className="w-full p-2 rounded-full border border-transparent bg-white/10 text-white placeholder-gray-300 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 transition-all duration-300 sm:w-72 lg:w-96"
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Search movies or TV shows..."
      />
      {suggestions.length > 0 && (
        <ul
          className="absolute top-full left-0 mt-2 w-full max-h-60 bg-black rounded-lg overflow-y-auto z-50"
          ref={dropdownRef}
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              ref={index === highlightedIndex ? highlightedRef : null}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`p-2 cursor-pointer text-gray-300 ${
                index === highlightedIndex
                  ? "bg-blue-400 text-black"
                  : "hover:bg-blue-500 hover:text-white"
              }`}
            >
              {suggestion.name || suggestion.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
