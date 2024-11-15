import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SearchInput.scss";

const apiKey = "14af83f372fe18ca097a8721d92b7145";
const url = "https://api.themoviedb.org/3";

const SearchInput = () => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // Track highlighted suggestion
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const highlightedRef = useRef(null); // Ref for highlighted suggestion

  useEffect(() => {
    // Attach the scroll listener when suggestions are rendered
    if (dropdownRef.current) {
      const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = dropdownRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 100) {
          setPage((prev) => (prev < 6 ? prev + 1 : prev));
        }
      };

      dropdownRef.current.addEventListener("scroll", handleScroll);
      return () => {
        dropdownRef.current?.removeEventListener("scroll", handleScroll);
      };
    }
  }, [dropdownRef.current, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSuggestions([]);
        setHighlightedIndex(-1);
        setSearch("");
        setPage(1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSuggestions([]);
    setHighlightedIndex(-1);
    setPage(1);
    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(
          `${url}/search/multi?api_key=${apiKey}&query=${search}&include_adult=false`
        );
        const filteredResults = res.data.results.filter(
          (item) => item.media_type !== "person"
        );
        setSuggestions(
          filteredResults.filter(
            (item, index, self) =>
              index === self.findIndex((m) => m.id === item.id)
          )
        );
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };
    if (search !== "") {
      fetchSuggestions();
    }
  }, [search]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(
          `${url}/search/multi?api_key=${apiKey}&query=${search}&include_adult=false&page=${page}`
        );
        const filteredResults = res.data.results.filter(
          (item) => item.media_type !== "person"
        );
        setSuggestions((prev) =>
          [...prev, ...filteredResults].filter(
            (item, index, self) =>
              index === self.findIndex((m) => m.id === item.id)
          )
        );
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };
    fetchSuggestions();
  }, [page]);

  const handleSuggestionClick = (suggestion) => {
    setSearch("");
    setSuggestions([]);
    navigate("/search", {
      state: { searchTerm: suggestion.name || suggestion.title },
    });
  };

  const handleKeyDown = (e) => {
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
        handleSuggestionClick({ name: search });
      }
    }
  };

  useEffect(() => {
    if (highlightedRef.current) {
      highlightedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightedIndex]);

  return (
    <div className="search-input-container">
      <input
        className="search-input"
        type="text"
        value={search}
        onChange={(e) => {
          if (e.target.value === "") {
            setSuggestions([]);
          }
          setSearch(e.target.value);
        }}
        onKeyDown={handleKeyDown} // Add keyboard navigation handler
        placeholder="Search movies or TV shows..."
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-dropdown" ref={dropdownRef}>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              ref={index === highlightedIndex ? highlightedRef : null} // Ref for the highlighted item
              onClick={() => handleSuggestionClick(suggestion)}
              className={`suggestion-item ${
                index === highlightedIndex ? "highlighted" : ""
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
