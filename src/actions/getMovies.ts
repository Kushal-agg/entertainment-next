"use server";

import axios from "axios";

const apiKey = "14af83f372fe18ca097a8721d92b7145";

export async function fetchTrendingMovies(page) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&include_adult=false&page=${page}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }

    const data = await response.json();
    
    return data.results
      .filter((item) => item.poster_path !== null)
      .filter(
        (item, index, self) =>
          index === self.findIndex((m) => m.id === item.id)
      );
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw error;
  }
}

export async function fetchTrendingTVShows(page) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}&include_adult=false&page=${page}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch TV shows');
    }

    const data = await response.json();
    
    return data.results
      .filter((item) => item.poster_path !== null)
      .filter(
        (item, index, self) =>
          index === self.findIndex((m) => m.id === item.id)
      );
  } catch (error) {
    console.error('Error fetching trending TV shows:', error);
    throw error;
  }
}
